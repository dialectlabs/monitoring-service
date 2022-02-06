FROM node:16-alpine

WORKDIR /app

RUN npm i -g rimraf

COPY package.json yarn.lock .npmrc ./
RUN --mount=type=secret,id=github,dst=/root/.npmrc yarn

COPY . ./
RUN yarn build

EXPOSE 8080
CMD [  "node", "dist/main.js" ]