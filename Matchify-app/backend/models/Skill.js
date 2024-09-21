import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajusta la ruta según la ubicación de database.js
import Usuario from './User.js'; // Asegúrate de que la ruta sea correcta

const Skill = sequelize.define('Skill', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivelDominio: {
        type: DataTypes.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'Skills',
    timestamps: true, // Si quieres que Sequelize maneje las fechas de creación y actualización
});

// Definir la asociación con Usuario
Skill.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export default Skill;
