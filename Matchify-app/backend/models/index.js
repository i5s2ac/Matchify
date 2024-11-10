'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

// Conectar a la base de datos MongoDB usando la URL de conexión desde las variables de entorno
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tu_base_de_datos';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Leer y registrar automáticamente todos los modelos en el directorio actual
fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file));
      db[model.modelName] = model;
    });

db.mongoose = mongoose;

module.exports = db;
