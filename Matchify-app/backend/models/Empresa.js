// models/Empresa.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import Industria from './Industria'; // Importar el modelo Industria para asegurar que esté referenciado correctamente

const Empresa = sequelize.define('Empresa', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    telefono: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    sitioWeb: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    industriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Industria, // Asegura que la referencia sea al modelo correcto
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresas',
    timestamps: true, // Añade campos de createdAt y updatedAt si lo deseas
});

// Asociación con Industria
Empresa.belongsTo(Industria, { foreignKey: 'industriaId', as: 'industria' });

export default Empresa;
