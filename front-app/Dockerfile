FROM node:lts-alpine  as dev

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

RUN yarn add glob rimraf

COPY . .
RUN yarn build

FROM node:lts-alpine as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN npm install --production

COPY . .
COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]