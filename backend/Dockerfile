FROM arm32v7/node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install -g wait-port


COPY . .

EXPOSE 4004

CMD ["sh", "-c", "echo 'Waiting for DB...' && wait-port mariadb:3306 && echo 'DB ready' && npm run dev"]

