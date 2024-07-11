FROM node:lts-alpine

WORKDIR /app

COPY ./dist/apps/draft-api .
COPY package.json package-lock.json ./

ENV PORT=3333
EXPOSE ${PORT}

RUN npm install --production
RUN npm install reflect-metadata express

CMD node ./main.js