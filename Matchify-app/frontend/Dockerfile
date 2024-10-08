# Etapa de construcción
FROM node:18 AS build

WORKDIR /usr/src/app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build


# Etapa de desarrollo (para hot-reload)
FROM node:18 AS development

WORKDIR /usr/src/app

# Copia solo los archivos necesarios de la etapa de construcción
COPY --from=build /usr/src/app ./

# Establece el modo de desarrollo
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "run", "dev"]


# Etapa de producción
FROM node:18 AS production

WORKDIR /usr/src/app

# Copia los archivos de la etapa de construcción
COPY --from=build /usr/src/app ./

# Establece el modo de producción
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
