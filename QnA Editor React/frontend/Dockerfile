FROM node:16

COPY . /app

WORKDIR /app/frontend

RUN npm i --force
EXPOSE 8005

CMD ["npm", "start"]
