import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajusta la ruta según sea necesario
import User from './User.js'; // Asegúrate de que el modelo User esté correctamente importado

const Educacion = sequelize.define('Educacion', {
    institucion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gradoObtenido: {
        type: DataTypes.STRING,
    },
    campoEstudio: {
        type: DataTypes.STRING,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,  // Para manejar solo la fecha sin hora
    },
    fechaFin: {
        type: DataTypes.DATEONLY,  // Lo mismo aquí
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Clave foránea no puede ser nula
        references: {
            model: User,  // Asegúrate de referenciar el modelo correcto
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'educacion',
    timestamps: true,  // Si quieres timestamps automáticos (createdAt, updatedAt)
});

// Exportar el modelo
export default Educacion;
