# Étape 1 : Build du front
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur web pour la prod
FROM node:24-alpine AS runner

WORKDIR /app

# Installer un serveur statique (serve)
RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
