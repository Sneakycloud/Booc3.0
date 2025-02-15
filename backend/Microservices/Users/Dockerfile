FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY ../../package*.json ./
COPY backend/Microservices/Users/usersMs.js ./
RUN npm ci --omit=dev
COPY backend/Microservices/Users/Controller ./Controller
COPY backend/Microservices/Users/Model ./Model
COPY backend/Microservices/Users/Router ./Router

CMD node usersMS.js
