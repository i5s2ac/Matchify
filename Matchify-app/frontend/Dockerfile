# Etapa de construcción
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Etapa de producción
FROM node:18 AS production

WORKDIR /usr/src/app

# Copia solo los archivos necesarios de la etapa de construcción
COPY --from=build /usr/src/app ./

EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start"]

