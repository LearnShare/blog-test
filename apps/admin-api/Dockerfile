FROM node:22-alpine AS base


FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN npx turbo prune api --docker


FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY --from=builder /app/out/full/ .
RUN corepack enable
RUN pnpm i
RUN pnpm run build


FROM base AS runner

WORKDIR /app
COPY --from=installer /app .

WORKDIR /app/apps/api


CMD ["npm", "run", "start"]
