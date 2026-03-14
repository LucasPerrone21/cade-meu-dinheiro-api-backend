FROM node:20-alpine

WORKDIR /app

# Copia apenas arquivos necessários para instalar dependências
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --only=production

# Prisma client
RUN npx prisma generate

# Copia o restante do código
COPY . .

EXPOSE 3000  

CMD ["npm", "start"]
