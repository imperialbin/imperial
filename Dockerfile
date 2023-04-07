FROM node:16-alpine AS builder

WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=api --docker

FROM node:alpine AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN cd apps/api && yarn install
RUN yarn build --scope=api
RUN ls
RUN cd apps/api && ls

FROM zenika/alpine-chrome:with-node as runner
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1

WORKDIR /app

COPY --from=installer /app .

CMD cd apps/api && yarn start