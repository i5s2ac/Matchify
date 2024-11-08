// models/Idioma.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajusta la ruta según la ubicación de database.js
import Usuario from './User.js'; // Asegúrate de que la ruta sea correcta

const Idioma = sequelize.define('Idioma', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivelDominio: {
        type: DataTypes.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
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
    tableName: 'idiomas',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

// Definir la asociación con Usuario
Idioma.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export default Idioma;
