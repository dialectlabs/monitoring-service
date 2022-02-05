FROM node:16-alpine

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn

COPY . .

RUN yarn build

CMD [  "node", "dist/main.js" ]
