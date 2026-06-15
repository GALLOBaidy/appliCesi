# Étape 1 : Build du front
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur web pour la prod
FROM node:26-alpine AS runner

WORKDIR /app

# Installer un serveur statique (serve)
RUN npm install -g serve

# Copier le dossier dist généré par Vite
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]