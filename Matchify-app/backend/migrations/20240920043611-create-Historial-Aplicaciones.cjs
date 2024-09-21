'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historial_aplicaciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fechaAplicacion: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estadoAplicacion: {
        type: Sequelize.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Asegúrate de que el nombre de la tabla sea correcto
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ofertaEmpleoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ofertas_empleos', // Asegúrate de que el nombre de la tabla sea correcto
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
    await queryInterface.dropTable('historial_aplicaciones');
  }
};
