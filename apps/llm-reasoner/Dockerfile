FROM node:18-alpine AS builder

WORKDIR /app

# Copy package configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/llm-reasoner/package.json ./apps/llm-reasoner/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/llm-reasoner/ ./apps/llm-reasoner/

# Build shared types and LLM Reasoner
RUN pnpm --filter @suppletime/shared-types build
RUN pnpm --filter @suppletime/llm-reasoner build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/llm-reasoner/package.json ./apps/llm-reasoner/
COPY --from=builder /app/apps/llm-reasoner/dist ./apps/llm-reasoner/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

# Install production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3001

CMD ["node", "apps/llm-reasoner/dist/main"]
