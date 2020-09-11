import React from 'react';
import {Link} from "react-router-dom";
import Axios from 'axios';
import {setPasswordReset} from "../../actions/index"
import { connect } from "react-redux";
import swal from 'sweetalert';

//SE AGREGO CONSTANTE PARA LAS CREDENCIALES
const instance = Axios.create({
  withCredentials: true
})

//se importo Link de react-router-dom
//Se paso el componente user a clase
export  class User extends React.Component {
  constructor(props){
    super(props)
  }

  //SWEET ALERT PARA CONFIRMAR EL DELETE DEL USER!
  borrar (e){
    swal({
      title: "¿Desea borrar usuario?",
      icon: "warning",
      buttons: ["No","Si"],
      dangerMode: true
    }).then(willDelete=>{
      if(willDelete){
        instance.delete("http://localhost:3001/admin/"+this.props.id,{withCredentials:true})
      .then(async res=>{
        await swal({text: "Usuario eliminado",icon:"error"});
        return;
      })
      .then(res=>{window.location.reload(false);})
     }
    })
    
    //MANEJO DE EERORES
    .catch(err=>{
      alert(err)
    })
  }

    //SWEET ALERT PARA HACER UN USUARIO ADMINISTRADOR
  administrador(){
    swal({
      title: "¿Desea modificar usuario?",
      icon: "warning",
      buttons: ["No","Si"],
      dangerMode: true
    })
    .then(willDelete=>{
      if(willDelete){
        console.log(this.props.id)
        instance.put("http://localhost:3001/admin/isAdmin/"+this.props.id,{withCredentials:true})
        .then(async res=>{
          await swal({text: "El usuario ahora es administrador!",icon:"success"});
          return;
        })
        .then(res=>{window.location.reload(false);})
      } 
    }) 

    //MANEJO DE ERRORES
    .catch(err=>{
      alert(err);
    })
  }

//se traen las nuevas actions y se utilizan dentro del boton "Resetear Password"
  reseteaLaPassword(){
    swal({
      title: "¿Desea resetear la password del usuario?",
      icon: "warning",
      buttons: ["No","Si"],
      dangerMode: true
    }).then(async willDelete=>{
       if (willDelete){
        await swal({text: "El usuario  ahora debera reiniciar se password!",icon:"info"});
        this.props.setPasswordReset(this.props.id);
        return;
       }
    }) 
    .then(res=>{window.location.reload(false);})
  }

// se agrego el link to correctament, mirar app para la ruta
  render(){
    return (  
      <div className="divroot">
        <div className = "container">
          <h5 className = "texto">User Id:{this.props.id}</h5>
          <Link to={`/users/${this.props.id}`}>
            <p className = "p"> Usuario:{this.props.nombre+" "+this.props.apellido}</p>
          </Link>
          <p className = "p"> Email:{this.props.email}</p>

          {/* FUNCIONES PARA EL ADMIN -> BORRA, MODIFICA USUARIOS */}
          <button type="button" class="btn btn-outline-primary">
            
            {/* ICONO DE TRASH DE BOOTSTRAP */}
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e)=>this.borrar(e)}>
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
          
          <button type="button" class="btn btn-outline-primary" onClick={()=>this.reseteaLaPassword()}>Reset Password</button>
          <button type="button" class="btn btn-outline-primary" onClick={()=>this.administrador()}>Administrador</button>
        </div>
      </div>        
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPasswordReset: id => dispatch(setPasswordReset(id))
  };
}

export default connect(null,mapDispatchToProps)(User);