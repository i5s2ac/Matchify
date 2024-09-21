import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import OfertaEmpleo from './OfertaEmpleo.js'; // Mantén las importaciones directas
import User from './User.js'; // Importa el modelo `User` directamente si es posible

const CandidatoOferta = sequelize.define('CandidatoOferta', {
    estado: {
        type: DataTypes.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Usamos la referencia directa al modelo `User`
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ofertaEmpleoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OfertaEmpleo, // Referencia al modelo `OfertaEmpleo`
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    tableName: 'candidato_oferta',
});

// Definir las asociaciones directamente
CandidatoOferta.belongsTo(User, { foreignKey: 'usuarioId', as: 'candidato' });
CandidatoOferta.belongsTo(OfertaEmpleo, { foreignKey: 'ofertaEmpleoId', as: 'ofertaEmpleo' });

export default CandidatoOferta;
