
module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("customer", {

    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING
    },
    license: {
      type: Sequelize.STRING
    },
    customer: {
      type: Sequelize.UUID,
      allowNull: true
    },
    licenseID: {
      type: Sequelize.UUID,
      allowNull: true
    },
    macaddress: {
      type: Sequelize.STRING
    }
  });

  return Tutorial;
};
