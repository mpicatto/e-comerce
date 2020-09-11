const server = require('express').Router();
const { User, Order_line, Product, Order } = require('../db.js');
const { Sequelize } = require('sequelize');
const  { bcrypt, hash } = require( 'bcryptjs');
const {isAuthenticated} =require('./helpers')

//REVISAR ESTA RUTA...
//crear un usuario
server.post('/',async(req,res,next)=>{
  //en caso de que falte algun campo devolver un error
  let {nombre,
    apellido,
    calle,
    numero,
    departamento,
    localidad,
    provincia,
    telefono1,
    telefono2,
    email,
    password} = req.body;


  password = await hash(password,10);
     //se crea el usuario
      User.create({
        nombre,
        apellido,
        calle,
        numero,
        departamento,
        localidad,
        provincia,
        telefono1,
        telefono2,
        email,
        password
      })
      .then(user=>{
          return res.status(201).send(user);
      })
  // }
});


//se trae todos los usuarios
server.get('/',(req,res,next)=>{
    User.findAll()
    .then(user=>{
        res.status(200).send(user);
    })
})

//Devuelve los datos del usuario que está logueado
server.get('/me',(req,res,next)=>{
  User.findByPk(req.user.id)
  .then(user=>{
    if (!user){
      res.status(401).send("Usuario no logueado");
    }
    else {
     res.status(200).json(user);
    }

  })
})


//Bucar usuario por ID
server.get('/id/:id',(req,res,next)=>{
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

//trae los usuarios por mail
server.get('/:email',(req,res,next)=>{
  let email = req.params.email
  console.log(email)
  User.findAll({
    where:{email:email}
  })
  .then(user=>{if(user){res.status(200).send(user);
  return}
  })})

//modificar un usuario
// ahora hashea la password nueva
server.put('/:id',async(req,res,next)=>{
  return User.findByPk(req.params.id)
  .then (async function(user){
    let {nombre,
      apellido,
      calle,
      numero,
      departamento,
      localidad,
      provincia,
      telefono1,
      telefono2,
      email,
      password} = req.body;
      password = await hash(password,10);
      user.nombre = nombre;
      user.apellido = apellido;
      user.calle = calle;
      user.numero = numero;
      user.departamento = departamento;
      user.localidad=localidad;
      user.provincia=provincia;
      user.telefono1 = telefono1;
      user.telefono2 = telefono2
      user.email = email;
      user.password= password;
      user.save();
      res.status(201).send("Usuario modificado")

    }).catch(err => res.status(400).send(err))
  })

/*  SE DEJA COMENTADO PUES ES UNA FUNCIÓN DEL ADMIN
//borra un usuario
server.delete('/:id',(req,res,next)=>{
    User.findByPk(req.params.id)
    .then(user=>{
        if (!user){
            //sino lo encuentra devuelve un error
            return res.status(400).send("Usuario inexistente");
        } else {
            //borra usuario
            user.destroy();
            return res.status(200).send("Usuario eliminado")
        }
    })
})
*/

server.post('/:id/cart',(req,res,next) =>{
  var orderID;

  const productId = req.body.productId;
  const price = req.body.price;
  const userId = req.params.id;
  Order.findOrCreate({
    where:{
      userId: userId,
      estado: 'carrito'
    }
  }) //findOrCreate devuelve un array
   .then(order => {

     orderID = order[0].id;
     Order_line.findOne({
       where: {
         orderId: orderID,
         productId: productId
       }
     })
     .then(resp => {
       if(resp !== null){ //si existe el producto entonces aumento en uno la cantidad
         resp.update({
           cantidad: resp.cantidad + 1
         })
       }
       else { //si no existe, creo una nueva fila en la tabla
         Order_line.create({
         cantidad: 1,
         productId: Number(productId),
         orderId: orderID,
         price: Number(price)
       })
      }
     })
   })
   res.send();
})

server.get('/:id/cart',(req,res,next) =>{ //devuelve el carrito de un usuario
  //console.log(req.params.id)
  if (req.params.id){
    Order.findOne({
      where:{
        userId: req.params.id,
        estado: "carrito"
      },include:{
        model: Product
      }
    })
    .then(respuesta => {
      res.status(200).send(respuesta);  
    })
    .catch(err=>{
      res.status(404).send(err)
    })
  }
  })


server.delete('/:id/cart',(req,res,next) =>{ //vaciamos carrito
  Order.findOne({
    where:{
      userId: req.params.id,
      estado: "carrito"
    }
  })
  .then(idOrder => {
    Order_line.findAll({
      where: {
        orderId: idOrder.id
      }
    })
    .then(filas => {
      filas.map(e => e.destroy());
      res.send();
    })
  })
})

server.delete('/:id/cart/:prodId',(req,res,next) =>{ //quitamos un producto del carrito
  Order.findOne({
    where:{
      userId: req.params.id,
      estado: "carrito"
    }
  })
  .then(idOrder => {
    Order_line.findOne({
      where: {
        orderId: idOrder.id,
        productId: req.params.prodId
      }
    })
    .then(fila => {
      fila.destroy();
      res.send();
    })
  })
})


server.put('/:id/cart/:prodId',(req,res,next) =>{ //Modificamos la cantidad de un producto del carrito
  Order.findOne({
    where:{
      userId: req.params.id,
      estado: "carrito"
    }
  })
  .then(idOrder => {
    Order_line.findOne({
      where: {
        orderId: idOrder.id,
        productId: req.params.prodId
      }
    })
    .then(fila => {
      if (typeof req.body.accion === "number"){
        fila.cantidad = req.body.accion
        fila.save()
      }else if (req.body.accion === "INC"){
        fila.cantidad += 1;
        fila.save()
      }else if(req.body.accion === "DEC"){
        if (fila.cantidad > 1){
          fila.cantidad -= 1
          fila.save()
        }
      } else {
        res.status(400).send("No se Reconoce el Comando: "+req.body.accion)
        return
      }
      res.status(201).send("Se modificó la cantidad: "+req.body.accion)
    })
    .catch(err => res.status(400).send(err))
  })
  .catch(err => res.status(400).send(err))
})

server.get("/:id/orders",(req,res,next) =>{
  //busca todas las ordenes de un usuario, incluyendo el carrito
  Order.findAll({
    where:{
      userId: req.params.id
    },
    include:{
      model:Product
    }
  })
  .then(respuesta =>{
    res.send(respuesta)
    //por cada orden devuelta, buscamos sus productos relacionados
  })
})

server.get("/:id/orders/:orderId",(req,res,next) =>{
  Order.findOne({
    where:{
      userId: req.params.id,
      id:req.params.orderId
    },
    include:{
      model:Product
    }
  })
  .then(respuesta =>{
    res.send(respuesta)
  })
})



module.exports = server;
