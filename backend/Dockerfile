FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . ./
RUN npm run build \
    && rm -rf ./src \
    && rm -rf node ./node_modules

FROM node:20-alpine as backend
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm i -g pm2
COPY --from=builder /app/dist ./dist/
COPY ./ecosystem.config.js ./
EXPOSE 3000


CMD ["pm2-runtime", "start", "ecosystem.config.js"]