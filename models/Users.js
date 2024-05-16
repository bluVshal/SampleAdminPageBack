const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
   '',
   'root',
   'wawayaya123',
    {
      host: 'localhost',
      dialect: 'mysql'
    }
  );

  const Users = sequelize.define("users", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userEmail: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isUserManager:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    userPassword:{
        type: DataTypes.STRING,
        allowNull: false
    },
    userLastLogin:{
        type: DataTypes.DATEONLY,
    },
    active:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    userCreatedDate:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
 });

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});