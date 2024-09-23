# Etapa de construcción
FROM node:18 AS build-backend

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo los archivos de configuración para aprovechar la caché
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos del backend
COPY . .

# Expone el puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
