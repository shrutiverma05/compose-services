FROM node:16.16.0

WORKDIR '/app'
COPY . /app

RUN npm i --force
EXPOSE 8010

CMD ["npm", "start"]