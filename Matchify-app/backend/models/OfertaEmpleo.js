import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
        allowNull: true,
    },
    salario: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    fechaPublicacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fechaCierre: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empresaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estatus: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo',
    },
    tags: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('tags');
            return rawValue ? rawValue.split(',') : [];
        },
        set(value) {
            if (Array.isArray(value)) {
                this.setDataValue('tags', value.join(','));
            } else {
                throw new Error('Los tags deben ser un arreglo.');
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
    Competencias__Requerimiento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'ofertas_empleos',
    timestamps: true,
});

export default OfertaEmpleo;
