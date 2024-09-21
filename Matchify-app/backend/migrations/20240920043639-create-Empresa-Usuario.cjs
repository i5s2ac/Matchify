'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empresa_usuario', {
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'empresas', // Asegúrate de que el nombre de la tabla sea correcto
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      rolId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles', // Asegúrate de que el nombre de la tabla sea correcto
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
    await queryInterface.dropTable('empresa_usuario');
  }
};
