const server = require('express').Router();
const { Product, Category, category_products,Review, User } = require('../db.js');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;


server.get("/category/:id", (req, res, next) => {
	Product.findAll({
		include: [{
    	model: Category,
    	where: {id: req.params.id}
   }]
 })
	.then(function(products){
    res.status(200).json(products);
  })
})

server.get("/:id", (req,res,next) =>{
	 Product.findByPk(req.params.id)
		.then(product => {
			if (!product){
				 res.status(404).send("No se encuentra el producto");
			 }
			 else {
				res.status(200).json(product);
			 }
		 })
})

server.get('/', (req, res, next) => {
	if (req.query.search){
		let aux = req.query.search;
		Product.findAll({
			where:{
				[Op.or]:[{
					name:{
						[Op.like]: '%'+aux+'%'
					}
				},
				{
				 	description:{
				 		[Op.like]: '%'+aux+'%'
				 	}
				}]
			}
		}).then (products => {
			if (!products.length){
				res.status(404).send("No se encontro el producto");
				return;
			}
      else {
				res.status(200).json(products);
				return;
			}
		})
	}
  else {
	Product.findAll()
		.then(products => {
			res.status(200).json(products);
			return;
		})
		.catch(next);
	}
});

//Ruta para crear Products
server.post('/', (req,res,next) =>{
	const {name, description, price, image, stock, categoryId} = req.body;

	//En caso de que no exista algun campo se devuelve error!
	if (!name || !price || !stock){
		res.status(400).send("Uno de los campos no ha sido completado");
	} else {
		//Se crea el Producto!
		Product.create({
			name,
			description,
			price,
			image,
			stock
		}).then (function(product){
			product.setCategories(categoryId)
			res.json(product);
		})

	}
});

//Ruta para actualizar un Producto por id
server.put('/:id', (req,res,next)=>{
	Product.findByPk(req.params.id)
	.then (product => {
		const {name, description, price, image, stock,categoryId} = req.body;
		product.name = name;
		product.description = description;
		product.price = price;
		product.image = image;
		product.stock = stock;
		product.setCategories(categoryId)
		product.save();

		res.status(201).send("Se modifico el Producto");
	})
});

//Ruta que borra un producto en particular
server.delete('/:id', (req,res,next) => {
	 Product.findByPk(req.params.id)
	 .then (function (product){
		 if (!product){
			 res.status(400).send("No se encuentra el producto");
			 return;
		 } else {
			product.destroy();
			res.status(200).send("Fichero eliminado!");
		 }
	 })
})

//Ruta para crear/agregar review
server.post('/:id/review', (req, res, next) => {
	const {puntuacion, comentario, userId} = req.body;
	let productId = req.params.id
	Review.create({
		puntuacion: puntuacion,
		comentario : comentario,
		userId: userId,
		productId: productId
	})
	.then (function(review){
		res.json(review);
	})
})

//Ruta para obtener las 5 primeras reviews
server.get('/:id/review_5', (req, res, next) => {
	let productId = req.params.id

	Review.findAll({
		limit:5,
		where:{productId:productId},
		include:[{model:User}]
})
 .then (function (reviews) {
		if (!reviews){
			res.status(400).send("No se encuentra el producto");
			return;
		}
		else {
		 res.status(200).send(reviews);
		}
	})
})

//Ruta para obtener todas las reviews
server.get('/:id/review', (req, res, next) => {
	let productId = req.params.id

	Review.findAll({
		where:{productId:productId},
		include:[{model:User}]
})
 .then (function (reviews) {
		if (!reviews){
			res.status(400).send("No se encuentra el producto");
			return;
		}
		else {
		 res.status(200).send(reviews);
		}
	})
})

//Ruta para modificar una review de un producto
server.put('/:id/review/:idReview', (req, res, next) => {
	Product.findByPk({
		include: [{
    	model: Review,
    	where: {id: req.params.id}
   }]
 })
 .then (product => {
		if (!product){
			res.status(400).send("No se encuentra producto");
			return;
		}
		else {
			Review.findByPk(req.params.idReview)
			.then (review => {
				if(!review){
					res.status(400).send("No se encuentran reviews para ese producto");
				}
				else{
					const {puntuacion, comentario} = req.body;
					review.puntuacion = puntuacion;
					review.comentario = comentario;
					review.save();
					res.status(201).send("Se modifico la review");
				}
			})
		}
	})
})

//Ruta para eliminar una review de un producto
server.delete('/:id/review/:idReview', (req, res, next) => {
	Product.findByPk({
		include: [{
    	model: Review,
    	where: {id: req.params.id}
   }]
 })
 .then (function (reviews) {
		if (!product){
			res.status(400).send("No se encuentra el producto");
			return;
		}
		else{
			Review.findByPk(req.params.idReview)
			.then (review => {
				review.destroy();
				res.status(201).send("La review fue eliminada");
		 		res.status(200).send(reviews);
			})
		}
	})
})

module.exports = server;

	// otra manera de hacer el delete!!
	//  Product.destroy({
	// 	 where:{
	// 		 id: req.params.id
	// 	 }
	//  })


	//manera para hacer el PUt
	// Object.keys(product).map(prop => {
	// 	product[prop]=req.body[prop]
	// })
