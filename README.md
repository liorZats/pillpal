# Suppletime MVP

Monorepo for Suppletime - Smart Supplement Scheduling System

## Project Structure

```
.
├── apps/
│   ├── api-gateway/     # NestJS API Gateway
│   ├── engine-java/     # Spring Boot Engine
│   ├── llm-reasoner/    # NestJS LLM Reasoning Service
│   └── web/            # Next.js Frontend
├── packages/
│   └── shared-types/   # Shared TypeScript types and Zod schemas
└── infrastructure/
    ├── docker/         # Docker compose files
    └── terraform/      # AWS Infrastructure as Code
```

## Prerequisites

- Node.js 18+
- pnpm 8+
- Java 21 JDK
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/api-gateway/.env.example apps/api-gateway/.env
   cp apps/llm-reasoner/.env.example apps/llm-reasoner/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. Start infrastructure (PostgreSQL, Redis):
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.yml up -d
   ```

4. Start all services in development mode:
   ```bash
   # Terminal 1: API Gateway
   pnpm dev -F api-gateway

   # Terminal 2: LLM Reasoner
   pnpm dev -F llm-reasoner

   # Terminal 3: Web Frontend
   pnpm dev -F web

   # Terminal 4: Java Engine (requires JDK 21)
   cd apps/engine-java
   ./gradlew bootRun
   ```

5. Seed the database (optional):
   ```bash
   curl -X POST http://localhost:3000/dev/seed
   ```

## Development

### Building

```bash
# Build all packages and apps
pnpm build

# Build specific app/package
pnpm build -F web
pnpm build -F api-gateway
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific app/package
pnpm test -F api-gateway
```

### Database Migrations

```bash
# Generate Prisma migration
cd apps/api-gateway
pnpm prisma migrate dev

# Apply migrations
pnpm prisma migrate deploy
```

## API Examples

Generate a supplement schedule:

```bash
curl -X POST http://localhost:3000/api/schedule/generate \
  -H "Content-Type: application/json" \
  -d '{
    "supplements": [
      {
        "id": "vitamin-d3",
        "name": "Vitamin D3",
        "dailyDoses": [
          {
            "amount": 5000,
            "unit": "IU"
          }
        ]
      }
    ],
    "profile": {
      "wakeTime": "07:00",
      "sleepTime": "23:00",
      "meals": [
        {
          "type": "BREAKFAST",
          "time": "08:00"
        },
        {
          "type": "LUNCH",
          "time": "13:00"
        },
        {
          "type": "DINNER",
          "time": "19:00"
        }
      ]
    }
  }'
```

## Infrastructure

### Local Development with Docker

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Stop all services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

### AWS Deployment

1. Initialize Terraform:
   ```bash
   cd infrastructure/terraform
   terraform init
   ```

2. Plan deployment:
   ```bash
   terraform plan -var-file=prod.tfvars
   ```

3. Apply changes:
   ```bash
   terraform apply -var-file=prod.tfvars
   ```

## CI/CD

GitHub Actions workflows are configured for:
- Node.js services build and test
- Java service build and test
- Docker image builds
- Infrastructure deployment

See `.github/workflows/` for detailed configurations.

## License

MIT
