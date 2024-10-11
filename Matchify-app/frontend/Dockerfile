# Usa la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia y cachea las dependencias de Node.js
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Configura las variables de entorno
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV PORT=3000

# Comando para iniciar la aplicación en desarrollo
CMD ["npm", "start"]
