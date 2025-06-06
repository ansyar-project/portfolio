# Improved Dockerfile for Next.js Portfolio App

# 1. Install dependencies with pnpm
FROM node:22-alpine AS deps
WORKDIR /app

# Install dumb-init for better signal handling
RUN apk add --no-cache libc6-compat dumb-init

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

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
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

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

# Create health check script
RUN echo 'const http = require("http"); \
const req = http.get("http://localhost:3000/api/health", (res) => { \
  process.exit(res.statusCode === 200 ? 0 : 1); \
}); \
req.on("error", () => process.exit(1)); \
req.setTimeout(5000, () => { req.destroy(); process.exit(1); });' > healthcheck.js

# Generate Prisma client and build the app
RUN pnpm build

# After build, clean dev dependencies
RUN pnpm prune --prod

# 3. Production image
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

# Copy standalone build (much smaller)
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/healthcheck.js ./

USER nonroot
EXPOSE 3000

# Simplified health check using the script
HEALTHCHECK --interval=5s --timeout=10s --start-period=5s --retries=5 \
  CMD ["/nodejs/bin/node", "healthcheck.js"]

CMD ["server.js"]
