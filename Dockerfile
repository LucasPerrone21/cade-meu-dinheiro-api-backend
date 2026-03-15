FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
COPY prisma ./prisma

RUN npm ci                        
RUN npx prisma generate           
RUN npm prune --production       

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]