FROM node:18.16.0-alpine3.17
LABEL authors="Bjorn Francke"
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD npm run dev
