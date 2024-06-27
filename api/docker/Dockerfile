FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY tsconfig.json .
COPY src ./src

RUN npm run build

EXPOSE 8008

RUN apk --no-cache add curl

CMD ["node", "dist/index.js"]