FROM node:lts-alpine  as dev
RUN apk --update add postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npm install glob rimraf

COPY . .
RUN chmod -R 777 ./node_modules/.prisma  ./node_modules/prisma
COPY ../.env .
RUN npm run build

FROM node:lts-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

COPY . .
RUN chmod -R 777 ./node_modules/.prisma  ./node_modules/prisma
COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]