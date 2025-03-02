FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
#COPY app.js ./
RUN npm ci --omit=dev
COPY ./public ./public
COPY ./src ./src

CMD npm start
