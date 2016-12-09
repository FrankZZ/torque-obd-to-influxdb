FROM node:6

RUN mkdir -p /opt/app

COPY package.json /tmp/package.json

RUN \
    cd /tmp && \
    npm i --production && \
    mv node_modules /opt/app/node_modules && \
    rm -rf /tmp/package.json /tmp/node_modules

WORKDIR /opt/app

COPY . .

EXPOSE 3001

CMD ["node", "."]
