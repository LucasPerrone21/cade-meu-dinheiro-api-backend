FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci                        # instala tudo
RUN npx prisma generate           # gera o client
RUN npm prune --production        # remove devDependencies depois

COPY . .

EXPOSE 3000

CMD ["npm", "start"]