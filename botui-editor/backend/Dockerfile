FROM node:16.16.0

WORKDIR /app/backend/

COPY . /app/backend/

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 8086
CMD ["node", "index.js"]

