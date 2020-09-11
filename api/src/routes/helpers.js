
//ESTE ES EL QUE VERIFICA SI ALGUIEN ESTA AUTENTICADO
const helpers = {}

//ESTA ES PARA SABER SI ESTA LOGUIADO
helpers.isAuthenticated = (req, res, next) =>{
  if(req.isAuthenticated()){

    //SI ESTA AUTENTICADO
    return next();
  }
  
  //NO ES NECESARIO LLEVARLO ACA.. SINO A DONDE QUERAMOS
  res.redirect('/login');
}

//ESTA ES PARA SABER SI EL USUARIO ES ADMIN
helpers.isAdmin = (req,res,next)=>{
  if (req.user.isAdmin){
    return next()
  }
  res.redirect('/login')
}

module.exports = helpers;