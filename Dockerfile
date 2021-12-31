FROM node:16-alpine3.11

WORKDIR /usr/src/app

ENV CHOKIDAR_USEPOLLING=true
