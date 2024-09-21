import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajusta la ruta según sea necesario
import User from './User.js'; // Asegúrate de que el modelo User esté correctamente importado

const Certificacion = sequelize.define('Certificacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizacionEmisora: {
        type: DataTypes.STRING,
    },
    fechaObtencion: {
        type: DataTypes.DATEONLY,  // Maneja solo la fecha sin la hora
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Clave foránea no puede ser nula
        references: {
            model: User,  // Asegúrate de que el modelo User está correctamente referenciado
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'certificaciones',
    timestamps: true,  // Si quieres timestamps automáticos (createdAt, updatedAt)
});

// Exportar el modelo
export default Certificacion;
