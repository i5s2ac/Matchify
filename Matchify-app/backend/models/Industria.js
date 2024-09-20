// models/Industria.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js

const Industria = sequelize.define('Industria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegura que los nombres de industria sean únicos
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true, // Permite que la descripción sea opcional
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true, // Si decides añadir un código identificador único
    },
}, {
    tableName: 'industrias',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

export default Industria;
