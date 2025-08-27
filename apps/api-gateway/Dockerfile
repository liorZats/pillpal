FROM node:18-alpine AS builder

WORKDIR /app

# Copy package configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/api-gateway/ ./apps/api-gateway/

# Build shared types and API Gateway
RUN pnpm --filter @suppletime/shared-types build
RUN pnpm --filter @suppletime/api-gateway build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

# Install production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/main"]
