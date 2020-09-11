const { Sequelize, Op, Model, DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('user', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    localidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
      	isEmail: true
      }
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
    // is: /^[0-9a-f]{64}$/i
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    pwdReset: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }

  });
};
