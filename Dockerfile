# Stage 1: Build backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy shared types first
COPY shared/ ./shared/

# Copy and install backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ .

RUN npm run build

# Stage 2: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy shared types (needed for frontend compilation)
COPY shared/ ./shared/

# Copy and install frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine

RUN apk add --no-cache nginx supervisor curl

RUN mkdir -p /app/backend \
             /var/log/supervisor \
             /var/log/nginx \
             /run/nginx \
             /etc/nginx/http.d

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend
COPY --from=backend-builder /app/backend/dist /app/backend/dist
COPY --from=backend-builder /app/backend/package*.json /app/backend/
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules

# Copy configuration files
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
