FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
COPY prisma ./prisma

RUN npm ci                        
RUN npx prisma generate           

COPY . .

RUN npm run build

RUN npm prune --production       

EXPOSE 64242

CMD ["node", "dist/src/main.js"]