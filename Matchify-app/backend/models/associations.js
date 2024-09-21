import User from './User.js';
import OfertaEmpleo from './OfertaEmpleo.js';

const defineAssociations = () => {
    User.hasMany(OfertaEmpleo, { foreignKey: 'userId', as: 'ofertasEmpleo' });
    OfertaEmpleo.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
};

export default defineAssociations;
