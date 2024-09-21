// models/EmpresaUsuario.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajusta la ruta según la ubicación de database.js
import Empresa from './Empresa.js';
import User from './User.js';
import Rol from './Rol.js';

const EmpresaUsuario = sequelize.define('EmpresaUsuario', {
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    rolId: {
        type: DataTypes.INTEGER,
        references: {
            model: Rol,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'empresa_usuario',
});

// Definir las asociaciones
EmpresaUsuario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });
EmpresaUsuario.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });
EmpresaUsuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });

export default EmpresaUsuario;
