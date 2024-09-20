import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import User from './User'; // Asegúrate de que la ruta sea correcta

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    resumenProfesional: {
        type: DataTypes.TEXT,
        allowNull: true, // Permite que sea opcional
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true, // Permite que sea opcional
    },
    fechaUltimaActualizacion: {
        type: DataTypes.DATE,
        allowNull: true, // Permite que sea opcional
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'perfil_usuarios',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

// Definir la asociación con User
PerfilUsuario.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

export default PerfilUsuario;
