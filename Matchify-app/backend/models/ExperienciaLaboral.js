// models/ExperienciaLaboral.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import User from './User'; // Asegúrate de que la ruta sea correcta

const ExperienciaLaboral = sequelize.define('ExperienciaLaboral', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    usuarioId: { // Ajusté el nombre a 'usuarioId' para mantener la convención
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Referencia al modelo User
            key: 'id',
        },
    },
    tituloPuesto: { // Cambié el nombre a camelCase
        type: DataTypes.STRING,
        allowNull: false,
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fechaInicio: { // Cambié a camelCase
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    fechaFin: { // Cambié a camelCase
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true, // Agrega campos createdAt y updatedAt
    tableName: 'experiencia_laboral', // Nombre de la tabla en la base de datos
});

// Definir la asociación con User
ExperienciaLaboral.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

export default ExperienciaLaboral;
