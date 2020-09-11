const server = require('express').Router();
const { category_products } = require('../db.js');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;


server.post('/', (req,res,next) =>{
	const {productId, categoryId} = req.body;

	//En caso de que no exista algun campo se devuelve error!
	if (!productId || !categoryId){
		res.status(400).send("uno de los id no existe");
	} else {
		//Se crea la categoria!
		category_products.create({
			 productId,
			categoryId
		}).then (function(category){
			res.send(category);
		})

	}
});

module.exports = server;