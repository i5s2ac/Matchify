// models/HistorialAplicaciones.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import User from './User'; // Asegúrate de que la ruta sea correcta
import OfertaEmpleo from './OfertaEmpleo'; // Asegúrate de que la ruta sea correcta

const HistorialAplicaciones = sequelize.define('HistorialAplicaciones', {
    fechaAplicacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estadoAplicacion: {
        type: DataTypes.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
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
    ofertaEmpleoId: {
        type: DataTypes.INTEGER,
        references: {
            model: OfertaEmpleo,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'historial_aplicaciones',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

// Definir las asociaciones con User y OfertaEmpleo
HistorialAplicaciones.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });
HistorialAplicaciones.belongsTo(OfertaEmpleo, { foreignKey: 'ofertaEmpleoId', as: 'ofertaEmpleo' });

export default HistorialAplicaciones;
