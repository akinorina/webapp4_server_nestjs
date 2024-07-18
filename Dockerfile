# ビルド環境
FROM node:22.2.0-bullseye-slim as builder
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y procps

## ビルド必要なパッケージをインストール
COPY package*.json ./
RUN npm install

## ビルドの実施
COPY . .
COPY .env.develop.local .env
RUN npm run build

# 実行環境
FROM node:22.2.0-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app

## ビルド環境からビルド済みのファイル等をコピーし、当該フォルダのオーナーをnodeユーザーへ変更
COPY --from=builder --chown=node:node /usr/src/app/ /usr/src/app/ 
## 動作に必要なパッケージのインストール
RUN npm ci --only=production

RUN npm install pm2 -g

EXPOSE 3000

## nodeユーザーとして実行
USER node

# run webapp server of nestjs by PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
