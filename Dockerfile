FROM node:14


RUN npm install -g typescript \
    && npm install -g ts-node

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

RUN apt-get update \
    && apt-get install sudo

RUN chmod +x /var/www/html/start.sh
RUN export $(grep -v '^#' .env | xargs)

CMD [ "node", "index.js" ]