# Usa una imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente local al contenedor
COPY . .

# Exponer el puerto 3000 para desarrollo
EXPOSE 3000

# Establecer variable de entorno para habilitar el hot-reloading
ENV CHOKIDAR_USEPOLLING=true

# Iniciar la aplicación en modo desarrollo
CMD ["npm", "start"]
