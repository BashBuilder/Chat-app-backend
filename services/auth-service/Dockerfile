# syntax=docker/dockerfile:1

# -------------------------
# Base
# -------------------------
FROM node:24-alpine AS base

RUN corepack enable && corepack prepare pnpm@11.13.0 --activate

WORKDIR /app

# -------------------------
# Dependencies
# -------------------------
FROM base AS deps

# Root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Workspace package manifests
COPY packages/common/package.json ./packages/common/
COPY services/auth-service/package.json ./services/auth-service/

# Install all dependencies needed for building
RUN pnpm install --frozen-lockfile --ignore-scripts

# -------------------------
# Build
# -------------------------
FROM deps AS build

# Copy source
COPY packages/common ./packages/common
COPY services/auth-service ./services/auth-service

# Build dependencies first
RUN pnpm --filter @chatapp/common build

RUN pnpm list --filter @chatapp/common --depth=0
RUN ls -la packages/common
RUN ls -la packages/common/node_modules
RUN ls -la node_modules

# Then build the service
RUN pnpm --filter @chatapp/auth-service build

# -------------------------
# Production
# -------------------------
FROM base AS production

ENV NODE_ENV=production
ENV AUTH_SERVICE_PORT=4003

# Create non-root user
RUN addgroup -S nodejs && \
    adduser -S nodeuser -G nodejs

# Root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Workspace manifests
COPY packages/common/package.json ./packages/common/
COPY services/auth-service/package.json ./services/auth-service/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy compiled output
COPY --from=build /app/packages/common/dist ./packages/common/dist
COPY --from=build /app/services/auth-service/dist ./services/auth-service/dist

# Give ownership to the application user
RUN chown -R nodeuser:nodejs /app

USER nodeuser

WORKDIR /app/services/auth-service

EXPOSE 4003

CMD ["node", "dist/index.js"]
# CMD ["pnpm", "dev"]