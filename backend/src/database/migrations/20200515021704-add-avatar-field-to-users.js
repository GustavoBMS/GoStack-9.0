'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    //Essa migration adicionara a coluna FK avatar_id que referencia a coluna ID de files
    return queryInterface.addColumn(
      'users',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    )

  },

  down: (queryInterface) => {
      return queryInterface.removeColumn('users', 'avatar_id');
  }
};
