# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2: Runtime
FROM node:18-alpine

# ✅ REQUIRED for pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

RUN chmod +x start.sh
CMD ["sh", "start.sh"]
