const server = require('express').Router();
const { User } = require('../db.js');
//const passport = require('passport');
const {isAuthenticated,isAdmin} =require('./helpers')
//rutas para ver todos los usuarios, modificar un usuario, borrar un usuario

//se trae todos los usuarios
server.get('/',isAuthenticated,isAdmin,(req,res,next)=>{
    User.findAll()
    .then(user=>{
        res.status(200).send(user);
    })
})


//Bucar usuario por ID
server.get('/:id',isAuthenticated,isAdmin,(req,res,next)=>{
  User.findByPk(req.params.id)
  .then(user=>{
    if (!user){
      res.status(404).send("No se encuentra el usuario");
    }
    else {
     res.status(200).json(user);
    }

  })
})


//modificar un usuario para que sea Admin
server.put('/isAdmin/:id',isAuthenticated,isAdmin,(req,res,next)=>{
   User.findByPk(req.params.id)
  .then (function(user){
    user.isAdmin = true;
    user.save();
    res.status(201).send("El usuario es administrador")
  })
})

//modificar un usuario para resetpassword
//Ahora cada vez que se haga un request a esta ruta, el reseteo de la password se cambiara al estado contrario
server.put('/:id',(req,res,next)=>{
  return User.findByPk(req.params.id)
  .then (function(user){
    user.pwdReset = !user.pwdReset;
    user.save();
    res.status(201).send("El usuario debe actualizar la password")
  })
})


//borra un usuario (no lo borra de la base, sino que lo pasa a estado inactivo)
server.delete('/:id',isAuthenticated,isAdmin,(req,res,next)=>{
    User.findByPk(req.params.id)
    .then(user=>{
        if (!user){
            //sino lo encuentra devuelve un error
            return res.status(400).send("Usuario inexistente");
        } else {
            //borra usuario
            user.activo = false;
            user.save();
            return res.status(200).send("Usuario inactivo")
        }
    })
})

server.get('/:id/cart',(req,res,next) =>{ //devuelve todas las órdenes de un usuario
  Order.findOne({
    where:{
      userId: req.params.id,
      estado: "carrito"
    },include:{
      model: Product
    }
  })
  .then(respuesta => {
    if (!respuesta){
        res.status(404).send("Error. No hay carrito o no existe usuario")
    } else {
        res.status(200).send(respuesta);
    }
  })
})

module.exports = server;
