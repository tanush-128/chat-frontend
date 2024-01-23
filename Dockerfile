
##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
# RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN npm i

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# RUN \
#     if [ -f yarn.lock ]; then  yarn build; \
#     elif [ -f package-lock.json ]; then npm run build; \
#     elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
#     else echo "Lockfile not found." && exit 1; \
#     f

##### RUNNER

FROM --platform=linux/amd64 gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

ENV DATABASE_URL "postgresql://tanuedu128:8cMF2lUeWxsP@ep-steep-snowflake-a16e4wvg.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
ENV NEXTAUTH_URL "https://chat-appfrontend.azurewebsites.net/"
ENV NEXTAUTH_SECRET   "my_secret_2"
ENV GOOGLE_ID   "42552123265-msoo43qqlhvchgc5hpg85iidj9a4eq4e.apps.googleusercontent.com"
ENV GOOGLE_SECRET  "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"
ENV SOCKET_URL "https://chat-appbackend.azurewebsites.net"


CMD ["server.js"]