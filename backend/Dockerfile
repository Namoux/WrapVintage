# Étape 1 : Node.js 18
FROM node:18

# Crée le répertoire de travail
WORKDIR /app

# Copie package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances (seulement production)
RUN npm install --production

# Copie le reste du code
COPY . .

# Expose le port défini dans .env
EXPOSE 4004

# Commande pour démarrer le backend
CMD ["node", "server.js"]
