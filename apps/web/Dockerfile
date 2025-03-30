FROM node:18-alpine AS base


FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN corepack enable
RUN pnpm i
RUN pnpm run generate
RUN pnpm run build


FROM base AS runner

WORKDIR /app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
