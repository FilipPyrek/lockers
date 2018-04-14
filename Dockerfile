FROM node:8.9.0

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
  && echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list \
  && apt-get update \
  && apt-get install -y mongodb-org --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/lib/mongodb \
  && chown -R mongodb:mongodb /var/lib/mongodb

COPY ./ /app

WORKDIR /app

RUN npm i
RUN npm test
RUN npm run build

ENV PORT 80
ENV NODE_ENV production


RUN service mongod start \
  && mongo < initializeDatabase.mjs \
  && mongo admin --eval "db.shutdownServer();"

CMD service mongod start \
  && mongo < initializeDatabase.mjs \
  && npm run start:prod

VOLUME /var/lib/mongodb

EXPOSE 80
EXPOSE 27017
