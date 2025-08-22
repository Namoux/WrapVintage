# Étape 1 : Build Angular
FROM node:18 AS build

WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Build Angular en production
RUN npm run build -- --configuration production
# Le -- transmet --configuration production à ng build

# Étape 2 : Serveur Nginx pour l’Angular build
FROM nginx:stable-alpine

# Copie le build Angular dans le répertoire Nginx
COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html

# Copie la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarre Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]
