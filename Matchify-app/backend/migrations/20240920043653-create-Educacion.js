'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educacion', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      institucion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gradoObtenido: {
        type: Sequelize.STRING,
      },
      campoEstudio: {
        type: Sequelize.STRING,
      },
      fechaInicio: {
        type: Sequelize.DATEONLY,
      },
      fechaFin: {
        type: Sequelize.DATEONLY,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Asegúrate de que el nombre de la tabla sea correcto
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('educacion');
  }
};
