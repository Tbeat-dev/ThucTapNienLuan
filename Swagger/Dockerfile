FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV WRITE_SWAGGER_FILE=false

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .
RUN npm run generate:docs

USER node

EXPOSE 3000

CMD ["npm", "start"]
