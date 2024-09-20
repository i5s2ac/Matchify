'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('perfil_usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      resumenProfesional: {
        type: Sequelize.TEXT,
        allowNull: true, // Permite que sea opcional
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: true, // Permite que sea opcional
      },
      fechaUltimaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true, // Permite que sea opcional
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Asegúrate de usar el nombre correcto de la tabla
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('perfil_usuarios');
  }
};
