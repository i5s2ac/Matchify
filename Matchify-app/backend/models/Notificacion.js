import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import Usuario from './User'; // Asegúrate de que la ruta sea correcta

const Notificacion = sequelize.define('Notificacion', {
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fechaEnvio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('leída', 'no leída'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'notificaciones',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

// Definir la asociación con Usuario
Notificacion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export default Notificacion;
