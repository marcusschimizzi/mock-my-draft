FROM node:22-alpine AS base

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build all projects
RUN npx nx run-many --target=build --all

# This stage is a base for all app-specific Dockerfiles
FROM base AS runner

WORKDIR /app

# Copy the built projects and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps ./apps
COPY --from=base /app/package.json ./package.json