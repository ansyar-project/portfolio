# Improved Dockerfile for Next.js Portfolio App

# 1. Install dependencies with pnpm
FROM node:22-alpine AS deps
WORKDIR /app

# Install dumb-init for better signal handling
RUN apk add --no-cache libc6-compat dumb-init

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files (remove pnpm-workspace.yaml if it doesn't exist)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with production optimizations
RUN pnpm install --frozen-lockfile --prefer-offline

# 2. Build the app
FROM node:22-alpine AS builder
WORKDIR /app

# Install necessary packages for build
RUN apk add --no-cache libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code (order matters for caching)
COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs ./
COPY package.json pnpm-lock.yaml ./

# Build arguments for environment variables
ARG DATABASE_URL
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL} \
    ADMIN_USERNAME=${ADMIN_USERNAME} \
    ADMIN_PASSWORD=${ADMIN_PASSWORD} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Build the app
RUN pnpm build

# After build, clean dev dependencies
RUN pnpm prune --prod

# Create health check script
RUN echo 'const http = require("http"); \
const options = { hostname: "localhost", port: 3000, path: "/api/health", timeout: 5000 }; \
const req = http.get(options, (res) => { \
  process.exit(res.statusCode === 200 ? 0 : 1); \
}); \
req.on("error", () => process.exit(1)); \
req.on("timeout", () => { req.destroy(); process.exit(1); });' > healthcheck.js

# 3. Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Install dumb-init for better signal handling
RUN apk add --no-cache dumb-init curl

# Copy standalone build
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/healthcheck.js ./


USER node
EXPOSE 3000

# Use dumb-init for better signal handling
CMD ["dumb-init", "node", "server.js"]
