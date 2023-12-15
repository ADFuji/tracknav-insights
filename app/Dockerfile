FROM node:latest

WORKDIR /app

# Copie seulement package.json et package-lock.json s'ils existent
COPY package.json* ./

# Installation des dépendances
RUN npm install

# Copie de l'ensemble des fichiers
COPY . .

# Exposition du port APP_PORT
EXPOSE 3000

CMD ["node", "src/app.js"]
