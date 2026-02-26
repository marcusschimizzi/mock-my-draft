FROM node:20-alpine3.20 AS base

FROM base AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat

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

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build --workspace=@mmd/admin

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY scripts/healthcheck.js .

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin/public ./public

RUN mkdir -p /app/.next
RUN chown nextjs:nodejs /app/.next

COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node apps/admin/server.js
