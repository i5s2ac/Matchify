# Usa la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia y cachea las dependencias de Node.js
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Instala nodemon como dependencia de desarrollo
RUN npm install -g nodemon

# Configura el entorno de desarrollo y la observación de archivos
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en desarrollo con nodemon
CMD ["npm", "start"]

