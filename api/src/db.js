require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://postgres:root@localhost:5432/development`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, Category, category_products, Order, Order_line, User, Review} = sequelize.models;

// Aca vendrian las relaciones
//Product.hasMany(Reviews);
Product.belongsToMany(Category, { through: "category_products" }); //Product * ----- * Category
Category.belongsToMany(Product, { through: "category_products" }); //Category * ----- * Product
Product.belongsToMany(Order, { through: Order_line}); //Product * ---- * ORDER
Order.belongsToMany(Product, { through: Order_line}); //ORDER * ---- * Product
User.hasMany(Order); //USER 1 ---- * ORDER
Order.belongsTo(User); //ORDER * ---- User
User.hasMany(Review); //USER 1 ---- * Review
Review.belongsTo(User); // Review * --- 1 USER
Product.hasMany(Review); // Product 1 ---- * Review
Review.belongsTo(Product);


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
