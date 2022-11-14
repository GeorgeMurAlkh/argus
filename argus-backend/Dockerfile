FROM node:18.12.1

WORKDIR /argus-backend
COPY package.json .
RUN rm -rf node_modules/
RUN npm i
COPY . .
CMD npm run start:prod