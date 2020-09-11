const server = require('express').Router();
const { Product, Category, category_products } = require('../db.js');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

server.get("/product/:id", (req, res, next) => {
	Category.findAll({
		include: [{
    	model: Product,
    	where: {id: req.params.id}
   }]
 })
	.then(function(products){
		console.log("Algo :"+ req.params.id);
    res.status(200).json(products);
  })
})

server.get('/', (req, res, next) => {
	if (req.query.search){
		let aux = req.query.search;
		Category.findAll({
			where:{
				name:{
					[Op.like]: '%'+aux+'%'
				}
			}
		}).then (category => {
			if (!category.length){
				res.status(404).send("No se encontro la categoria");
				return;
			} else {
				res.status(200).send(category);
				return;
			}
		})
	} else {
	Category.findAll()
		.then(category => {
			res.status(200).send(category);
			return;
		})
		.catch(next);
	}
});

server.post('/', (req,res,next) =>{
	const {name, description} = req.body;
	console.log(req)

	//En caso de que no exista algun campo se devuelve error!
	if (!name){
		res.status(400).send("El nombre de la categoria es requerido");
	} else {
		//Se crea la categoria!
		Category.create({
			name,
			description
		}).then (function(category){
			res.send(category);
		})

	}
});

server.delete('/:id', (req,res,next)=>{
    Category.findByPk(req.params.id)
    .then (function (category){
        if (!category){
            res.status(400).send("No se encontro la categoria");
            return;
        } else {
           category.destroy();
           res.status(200).send("Categoria eliminado!");
        }
    })

});

server.put('/:id', (req,res,next)=>{
	return Category.findByPk(req.params.id)
	.then (function(category){
        category.name = req.body.name;
        category.description = req.body.description;
        category.save();
        res.status(201).send(category);
	})
});

module.exports = server;
