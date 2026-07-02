# Stage 1: build - cài dependency và sinh swagger.json
FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV WRITE_SWAGGER_FILE=false

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run generate:docs

# Stage 2: runtime - chỉ copy những gì cần chạy, bỏ hẳn npm CLI
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV WRITE_SWAGGER_FILE=false

COPY --from=builder --chown=node:node /app ./

USER node

EXPOSE 3000

CMD ["node", "index.js"]