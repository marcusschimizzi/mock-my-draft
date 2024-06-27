FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json .
COPY src ./src

RUN npm run build

FROM base AS runner
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8008

CMD ["node", "dist/index.js"]