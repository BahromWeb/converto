# Dockerfile — apps/web Next.js production image
#
# Three-stage build:
#   1. deps    — install pnpm workspace deps (cached unless lockfile/manifests change)
#   2. builder — compile the web app + transpile workspace packages
#   3. runner  — slim runtime, Next standalone server only
#
# Build context expects the monorepo root:
#   docker build -t converto-web .

FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------

FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app
# Copy the whole tree from deps. pnpm scatters node_modules across every
# workspace package (apps/web/node_modules, packages/ui/node_modules,
# etc.), so cherry-picking the root one alone left every workspace
# package without its deps and `next: not found` at build time.
COPY --from=deps /app /app
ENV NEXT_TELEMETRY_DISABLED=1
# next.config.mjs sets `output: "standalone"` so the build emits a
# self-contained server bundle under apps/web/.next/standalone.
RUN pnpm --filter web build

# -----------------------------------------------------------------------------

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone output is a single-process Node server with every needed
# module already bundled — no pnpm install at runtime, no 800-MB
# node_modules in the image. Static assets and public/ are copied
# alongside; Next leaves them out of the standalone bundle on purpose
# so CDN-fronted setups can serve them from the edge.
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
