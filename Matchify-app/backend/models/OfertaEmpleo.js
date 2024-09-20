import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import Empresa from './Empresa'; // Asegúrate de que la ruta sea correcta
import User from './User'; // Asegúrate de que la ruta sea correcta

const OfertaEmpleo = sequelize.define('OfertaEmpleo', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [0, 255],
        },
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true, // Ajusta esto según tus necesidades
    },
    salario: {
        type: DataTypes.DECIMAL,
        allowNull: true, // Permite que sea opcional
    },
    fechaPublicacion: {
        type: DataTypes.DATE,
        allowNull: true, // Permite que sea opcional
    },
    fechaCierre: {
        type: DataTypes.DATE,
        allowNull: true, // Permite que sea opcional
    },
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
    },
    estatus: {
        type: DataTypes.ENUM('Activo', 'Cerrado'),
        allowNull: false,
        defaultValue: 'Activo',
    },
    tags: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('tags');
            return rawValue ? rawValue.split(',') : []; // Devuelve como array
        },
        set(value) {
            if (Array.isArray(value)) {
                this.setDataValue('tags', value.join(',')); // Almacena como string
            } else {
                throw new Error('Los tags deben ser un arreglo.'); // Error de validación
            }
        },
    },
    modalidad: {
        type: DataTypes.ENUM('Presencial', 'Virtual', 'Híbrido'),
        allowNull: false,
        defaultValue: 'Presencial',
    },
    tipoTrabajo: {
        type: DataTypes.ENUM('Tiempo Completo', 'Tiempo Parcial', 'Por Proyecto'),
        allowNull: false,
        defaultValue: 'Tiempo Completo',
    },
    Funciones_Requerimiento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Estudios_Requerimiento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Experiencia_Requerimiento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Conocimientos_Requerimiento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Competencias__Requerimiento: { // Verifica si el doble guion bajo es intencional
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'ofertas_empleos',
    timestamps: true, // Si deseas manejar fechas de creación y actualización
});

// Definir las asociaciones
OfertaEmpleo.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });
OfertaEmpleo.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

export default OfertaEmpleo;
