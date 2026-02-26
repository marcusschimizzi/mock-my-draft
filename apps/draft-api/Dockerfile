FROM node:20-alpine3.20 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy all workspace package.json files so npm ci can resolve workspaces
COPY package.json package-lock.json ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/admin-e2e/package.json ./apps/admin-e2e/package.json
COPY apps/data-collector/package.json ./apps/data-collector/package.json
COPY apps/draft-api/package.json ./apps/draft-api/package.json
COPY apps/draft-api-e2e/package.json ./apps/draft-api-e2e/package.json
COPY apps/mmd-public/package.json ./apps/mmd-public/package.json
COPY apps/mmd-public-e2e/package.json ./apps/mmd-public-e2e/package.json
COPY apps/text-analysis-service/package.json ./apps/text-analysis-service/package.json
COPY apps/text-analysis-service-e2e/package.json ./apps/text-analysis-service-e2e/package.json
COPY libs/visualizations/package.json ./libs/visualizations/package.json
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=@mmd/draft-api

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY scripts/healthcheck.js .

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

COPY --from=builder /app/apps/draft-api/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder /app/apps/admin-e2e/package.json ./apps/admin-e2e/package.json
COPY --from=builder /app/apps/data-collector/package.json ./apps/data-collector/package.json
COPY --from=builder /app/apps/draft-api/package.json ./apps/draft-api/package.json
COPY --from=builder /app/apps/draft-api-e2e/package.json ./apps/draft-api-e2e/package.json
COPY --from=builder /app/apps/mmd-public/package.json ./apps/mmd-public/package.json
COPY --from=builder /app/apps/mmd-public-e2e/package.json ./apps/mmd-public-e2e/package.json
COPY --from=builder /app/apps/text-analysis-service/package.json ./apps/text-analysis-service/package.json
COPY --from=builder /app/apps/text-analysis-service-e2e/package.json ./apps/text-analysis-service-e2e/package.json
COPY --from=builder /app/libs/visualizations/package.json ./libs/visualizations/package.json

RUN npm ci --omit=dev && npm cache clean --force

USER nodeapp

ENV PORT=3000
EXPOSE ${PORT}

CMD node ./main.js
