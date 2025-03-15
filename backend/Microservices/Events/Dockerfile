FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY backend/package*.json ./
COPY backend/Microservices/Events/eventsMs.js ./
RUN npm ci --omit=dev
COPY backend/Microservices/Events/Controller ./Controller
COPY backend/Microservices/Events/Model ./Model
COPY backend/Microservices/Events/Router ./Router

CMD node eventsMs.js