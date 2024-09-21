'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ofertas_empleos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [0, 255],
        },
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      salario: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      fechaPublicacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fechaCierre: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'empresas', // Asegúrate de que el nombre de la tabla referenciada sea correcto
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Asegúrate de que el nombre de la tabla referenciada sea correcto
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      estatus: {
        type: Sequelize.ENUM('Activo', 'Cerrado'),
        allowNull: false,
        defaultValue: 'Activo',
      },
      tags: {
        type: Sequelize.TEXT,
      },
      modalidad: {
        type: Sequelize.ENUM('Presencial', 'Virtual', 'Híbrido'),
        allowNull: false,
        defaultValue: 'Presencial',
      },
      tipoTrabajo: {
        type: Sequelize.ENUM('Tiempo Completo', 'Tiempo Parcial', 'Por Proyecto'),
        allowNull: false,
        defaultValue: 'Tiempo Completo',
      },
      Funciones_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Estudios_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Experiencia_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Conocimientos_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Competencias__Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ofertas_empleos');
  }
};
