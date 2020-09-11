const server = require('express').Router();
const { Product, Order, Order_line, User } = require('../db.js');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const {isAuthenticated, isAdmin} =require('./helpers');
const e = require('express');

//Devuelve todas las órdenes para todos los usuarios, sin incluir los carritos
server.get('/:condition',(req,res,next)=>{
    //console.log(req.params.condition)
    let estado = []
    if (req.params.condition == "todas"){
        estado = ['procesando','enviada','cancelada', 'completada']
    }else{estado=[req.params.condition]}
    //console.log(estado)
    Order.findAll({
      where: {
        estado: estado
      },
      include:[{model: Product}, {model: User}]
    })
    .then(orders=>{
        res.status(200).send(orders);
        return;
    })
});

//Devuelve todos las órdenes para un determinado usuario, sin incluir el carrito
server.get('/:id/products',(req,res,next)=>{
    Order.findOne({
      where: {
        estado: ['procesando','enviada','cancelada','completada'],
        id: req.params.id
      },
      include:[{model: Product}]
    })
    .then(orders=>{
        res.status(200).send(orders);
        return;
    })
});


//Devuelve todas las órdenes de un usuario, incluyendo el carrito
server.get('/:id',(req,res,next)=>{
    Order.findOne({
        where:{
            id: req.params.id
        }
    })
    .then(order=>{
        if (!order){
            res.status(404).send("No se encontró una órden asociada para ese usuario");
            return;
        } else {
            res.status(200).send(order);
            return;
        }
    })
})

//RUTA PARA QUE EL ADMIN MODIFIQUE LOS ESTADOS DE LAS ORDENES!!
server.put('/:id/:estado',isAuthenticated,isAdmin,(req,res,next)=>{
    Order.findOne({
        where:{
            id: req.params.id,
        }
    })

    //BUSCA LA ORDEN!
    .then(order=>{

        //SETEA EL ESTADO PASADO POR PARAMS!
        order.estado=req.params.estado;
        order.direccion=req.query.direccion
        order.save();
        res.status(201).send(order.data);
        return;
    })

    //MANEJO DE ERRORES
    .catch(err=>{
        res.send(err);
        return;
    })
})

server.put('/:id',isAuthenticated,(req,res,next)=>{
    Order.findOne({
        where:{
            id: req.params.id,
        }, include:[{model: Product}]
    })
    .then(order=>{
        order.products.map(el=>{
            
            //SE CONSULTAN LOS VALORES DE STOCK
            if (el.order_line.cantidad>el.stock){
                
                //RETORNA UN ERROR EN CASO DE QUE LA CANTIDAD DE COMPRA SUPERE AL STOCK
                res.status(400).send(el);
            } else {

                //SE BUSCA EL PRODUCTO PARA MODIFICAR EL STOCK
                Product.findByPk(el.id)
                .then(product=>{
                    //SE MODIFICA EL STOCK
                    product.stock = product.stock - el.order_line.cantidad;
                    product.save();
                })
            }
        })   
         order.estado = "procesando";
         order.save();
         //SE ENVIA LA ORDER COMPLETADA
         res.status(201).send(order)
    })
    //MANEJO DE ERRORES.. FIJARSE EN EL FRONT!
    .catch(err=>{
        res.send(err);
        return;
    })
})

module.exports = server;
