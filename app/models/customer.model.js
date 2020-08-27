const uuid = require('uuid/v4');

module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {

    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });

  return Tutorial;
};
