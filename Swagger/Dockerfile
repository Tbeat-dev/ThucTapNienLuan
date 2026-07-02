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

# Stage 2: runtime - loại bỏ toàn bộ CLI tooling không cần thiết
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV WRITE_SWAGGER_FILE=false

# Gỡ npm, npx, corepack, yarn khỏi image chạy production — chỉ cần "node" để chạy app
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/corepack \
    /opt/yarn-v*

COPY --from=builder --chown=node:node /app ./

USER node

EXPOSE 3000

CMD ["node", "index.js"]