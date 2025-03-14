FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
#COPY app.js ./
RUN npm ci --omit=dev
RUN npm install -g serve
COPY ./public ./public
COPY ./src ./src

#Adds env vars before the final build
ARG PROD
ARG BACKEND_IP
ENV REACT_APP_PROD=$PROD
ENV REACT_APP_BACKEND_IP=$BACKEND_IP


RUN npm run build

CMD serve -s build
