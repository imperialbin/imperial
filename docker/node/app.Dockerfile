FROM node:alpine

COPY ./services/node/packages/app/yarn.lock .
COPY ./services/node/packages/app/package.json .
RUN yarn

COPY ./services/node/packages/app .
RUN yarn build

CMD ["yarn", "start"]
