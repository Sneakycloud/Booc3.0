FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY backend/package*.json ./
COPY backend/Microservices/Groups/groupsMs.js ./
RUN npm ci --omit=dev
COPY backend/Microservices/Groups/Controller ./Controller
COPY backend/Microservices/Groups/Model ./Model
COPY backend/Microservices/Groups/Router ./Router

CMD node groupsMs.js