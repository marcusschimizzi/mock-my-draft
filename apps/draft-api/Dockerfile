FROM node:20-alpine3.20 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build draft-api

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY scripts/healthcheck.js .


RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

COPY --from=builder /app/dist/apps/draft-api ./
COPY --from=builder /app/package.json ./

RUN npm install --omit=dev && npm cache clean --force

USER nodeapp

ENV PORT=3000
EXPOSE ${PORT}

CMD node ./main.js