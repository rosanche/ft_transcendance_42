FROM node:lts-alpine  as dev
RUN apk --update add postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/


RUN yarn install

RUN yarn add glob

COPY . .
RUN chmod -R 777 ./node_modules/.prisma  ./node_modules/prisma
#RUN yarn build

FROM node:lts-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn install --production

COPY . .
RUN chmod -R 777 ./node_modules/.prisma  ./node_modules/prisma
COPY --from=dev /usr/src/app/dist ./dist
RUN npx prisma migrate dev --name 'transcendance'
CMD ["node", "dist/main"]