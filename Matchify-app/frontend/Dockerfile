# Etapa de construcción
FROM node:18 AS build-frontend

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo los archivos de configuración para aprovechar la caché
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos del frontend
COPY . .

# Compila la aplicación de React
RUN npm run build

# Usa una imagen más ligera para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos al contenedor de Nginx
COPY --from=build-frontend /usr/src/app/build /usr/share/nginx/html

# Expone el puerto
EXPOSE 80

# Nginx ya tiene su propio comando de inicio, así que no es necesario especificar uno
