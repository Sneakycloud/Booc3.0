FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY ../../package*.json ./
COPY userMS.js ./
RUN npm ci --omit=dev
COPY ./Controller ./Controller
COPY ./Model ./Model
COPY ./Router ./Router

CMD node usersMS.js
