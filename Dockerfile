
FROM node:16.20-alpine


WORKDIR /usr/src/app


COPY . .
# COPY package*.json ./

RUN npm install





EXPOSE 3000


CMD [ "npm", "start" ]
