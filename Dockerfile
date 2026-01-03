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

# Build template backend
WORKDIR /app/apps/template/backend
COPY apps/template/backend/package*.json ./
RUN npm install
COPY apps/template/backend/ .
RUN npm run build

# Build todo-list backend
WORKDIR /app/apps/todo-list/backend
COPY apps/todo-list/backend/package*.json ./
RUN npm install
COPY apps/todo-list/backend/ .
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

# Copy shared packages (built)
COPY --from=shared-builder /app/packages/shared-types /app/packages/shared-types
COPY --from=shared-builder /app/shared/frontend /app/shared/frontend

# Copy and install dependencies for app frontends (needed for TypeScript compilation)
WORKDIR /app/apps/template/frontend
COPY apps/template/frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY apps/template/frontend/ .

WORKDIR /app/apps/todo-list/frontend
COPY apps/todo-list/frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY apps/todo-list/frontend/ .

# Build main frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 5: Production image
FROM node:20-alpine

RUN apk add --no-cache nginx supervisor curl

RUN mkdir -p /app/backend \
             /app/apps/template/backend \
             /app/apps/todo-list/backend \
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
COPY --from=apps-backend-builder /app/apps/template/backend/dist /app/apps/template/backend/dist
COPY --from=apps-backend-builder /app/apps/template/backend/package*.json /app/apps/template/backend/
COPY --from=apps-backend-builder /app/apps/template/backend/node_modules /app/apps/template/backend/node_modules

COPY --from=apps-backend-builder /app/apps/todo-list/backend/dist /app/apps/todo-list/backend/dist
COPY --from=apps-backend-builder /app/apps/todo-list/backend/package*.json /app/apps/todo-list/backend/
COPY --from=apps-backend-builder /app/apps/todo-list/backend/node_modules /app/apps/todo-list/backend/node_modules

# Copy configuration files
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
