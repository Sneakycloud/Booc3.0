FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY app.js ./
RUN npm ci --omit=dev
COPY ./bin ./bin
COPY ./Controller ./Controller
COPY ./Model ./Model
COPY ./public ./public
COPY ./routes ./routes
COPY ./Service ./Service
COPY ./views ./views

CMD npm start
