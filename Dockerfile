FROM node:20-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* bun.lockb* ./

RUN apk add --no-cache python3 make g++ || true
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

FROM deps AS builder
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

# Copy built assets and production deps
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
