FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
#COPY app.js ./
RUN npm ci --omit=dev
RUN npm install -g serve
COPY ./public ./public
COPY ./src ./src
RUN npm run build

CMD serve -s build
