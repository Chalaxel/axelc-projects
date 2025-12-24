# Dockerfile for monorepo multi-apps deployment

# Stage 1: Build shared packages
FROM node:20-alpine AS shared-builder

WORKDIR /app

# Copy and build shared-types
COPY packages/shared-types/package*.json packages/shared-types/
WORKDIR /app/packages/shared-types
RUN npm install
COPY packages/shared-types/ .
RUN npm run build

# Copy and build shared backend
WORKDIR /app/shared/backend
COPY shared/backend/package*.json ./
RUN npm install
COPY shared/backend/ .
RUN npm run build

# Copy and build shared frontend
WORKDIR /app/shared/frontend
COPY shared/frontend/package*.json ./
RUN npm install
COPY shared/frontend/ .
RUN npm run build

# Stage 2: Build app backends
FROM node:20-alpine AS apps-backend-builder

WORKDIR /app

# Copy shared packages
COPY --from=shared-builder /app/packages/shared-types /app/packages/shared-types
COPY --from=shared-builder /app/shared /app/shared

# Build ladm backend
WORKDIR /app/apps/ladm/backend
COPY apps/ladm/backend/package*.json ./
RUN npm install
COPY apps/ladm/backend/ .
RUN npm run build

# Stage 3: Build main backend
FROM node:20-alpine AS main-backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Stage 4: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy shared packages
COPY --from=shared-builder /app/packages/shared-types /app/packages/shared-types

# Copy app frontends for importing
COPY apps/ladm/frontend /app/apps/ladm/frontend

# Build main frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 5: Production image
FROM node:20-alpine

RUN apk add --no-cache nginx supervisor curl

RUN mkdir -p /app/backend \
             /app/apps/ladm/backend \
             /var/log/supervisor \
             /var/log/nginx \
             /run/nginx \
             /etc/nginx/http.d

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy main backend
COPY --from=main-backend-builder /app/backend/dist /app/backend/dist
COPY --from=main-backend-builder /app/backend/package*.json /app/backend/
COPY --from=main-backend-builder /app/backend/node_modules /app/backend/node_modules

# Copy app backends
COPY --from=apps-backend-builder /app/apps/ladm/backend/dist /app/apps/ladm/backend/dist
COPY --from=apps-backend-builder /app/apps/ladm/backend/package*.json /app/apps/ladm/backend/
COPY --from=apps-backend-builder /app/apps/ladm/backend/node_modules /app/apps/ladm/backend/node_modules

# Nginx configuration
RUN echo 'server {\
    listen 8080;\
    server_name localhost;\
    \
    location / {\
        root /usr/share/nginx/html;\
        index index.html;\
        try_files $uri $uri/ /index.html;\
    }\
    \
    location /api {\
        proxy_pass http://127.0.0.1:3000;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection "upgrade";\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_cache_bypass $http_upgrade;\
    }\
    \
    location /health {\
        proxy_pass http://127.0.0.1:3000/health;\
    }\
}' > /etc/nginx/http.d/default.conf

# Supervisor configuration
RUN echo '[supervisord]\
nodaemon=true\
logfile=/var/log/supervisor/supervisord.log\
\
[program:nginx]\
command=nginx -g "daemon off;"\
autostart=true\
autorestart=true\
stdout_logfile=/var/log/nginx/access.log\
stderr_logfile=/var/log/nginx/error.log\
\
[program:backend]\
command=node /app/backend/dist/server.js\
directory=/app/backend\
autostart=true\
autorestart=true\
stdout_logfile=/dev/stdout\
stdout_logfile_maxbytes=0\
stderr_logfile=/dev/stderr\
stderr_logfile_maxbytes=0\
environment=NODE_ENV="production"' > /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
