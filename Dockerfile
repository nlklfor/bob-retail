# Multi-stage build for self-hosting on a VPS (see docs/deployment.md).
# Deps/build use Bun (matches local dev tooling and bun.lock); the runtime
# stage switches to plain Node, since `output: "standalone"` in
# next.config.ts produces a self-contained Node server that doesn't need
# Bun at all — Node is the most-tested runtime for Next's own self-host
# pattern, which matters more than tooling consistency once this is a real
# production container.

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `next build` statically prerenders some pages (the homepage, /about,
# /checkout, /faq, /contacts) at build time, and those pages fetch real
# data from Supabase — so the build itself needs real credentials, not
# just the running container. docker-compose.yml passes these through as
# build args, sourced from the same .env file used for the runtime
# environment below — one file, not two copies of the same secrets.
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
