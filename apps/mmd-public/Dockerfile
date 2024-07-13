FROM node:20-alpine3.20 AS base

FROM base AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx nx build mmd-public

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/mmd-public/public ./public

RUN mkdir -p /app/.next
RUN chown nextjs:nodejs /app/.next

COPY --from=builder /app/apps/mmd-public/.next/standalone ./
COPY --from=builder /app/apps/mmd-public/.next/static ./apps/mmd-public/.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node apps/mmd-public/server.js