import React from 'react';
import { connect } from 'react-redux';
import { addUser, setRedirect } from '../../actions/index';
import UserData from './UpdateUser'
import style from "./stilo.module.css"
import Axios from 'axios';

export  class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      email:"",
      password:"",
      newPassword:"",      
    }
  }
 
  handleInputChange(e){
    this.setState({[e.target.name]:e.target.value})
  }

  validateNew(e) {
    if (!/\S+@\S+\.\S+/.test(this.state.email)){
      alert("Debe ingresar un mail valido.(Formato: ejemplo@ejemplo.com)" )
      e.preventDefault();
      this.setState({
        email:"",
        password:"",
        newPassword:"" 
    })
    return
  }

  if (this.state.password != this.state.newPassword){
   alert("Las contraseñas ingresadas deben coincidir")
   e.preventDefault();
   this.setState({
   
     password:"",
     newPassword:"" 
 })
 return
}

  if(!/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(this.state.newPassword)){
    alert("La contraseña debe tener como minimo 8 caracteres y al menos 1 mayuscula, 1 minúscula y 1 dígito.")
    e.preventDefault();
      this.setState({
        password:"",
        newPassword:"" 
      })
      return
  }
  
    if (this.state.password === this.state.newPassword 
      && /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(this.state.newPassword)
      && /\S+@\S+\.\S+/.test(this.state.email)){
      Axios.get("http://localhost:3001/users/"+this.state.email)
      .then(res=>{
        console.log(res.data)
        if (res.data.length===0){
          let state = true
          this.props.addUser(this.state.email, this.state.password)
          this.props.setRedirect(state)

        }else{alert("El mail ya esta en uso")}
   
      })
    }
    e.preventDefault()
}

  render(){
    if(!this.props.redirect){
    return(
      <div>
        <form className={style.form}>
          <div class="form-group">
            <label for="exampleInputEmail1">Correo Electronico</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
             value={this.state.email} name="email" placeholder="Email registrado" onChange={(e) => this.handleInputChange(e)}></input>
            <small id="emailHelp" class="form-text text-muted">No compartiremos su cuenta de email con terceros</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Contraseña</label>
            <input type="password" class="form-control" id="exampleInputPassword1"
            value={this.state.password} name="password" placeholder="Contraseña" onChange={(e) => this.handleInputChange(e)}></input>
            <small id="passHelp" class="form-text text-muted">La contraseña debe tener como minimo 8 caracteres y al menos 1 mayuscula, 1 minúscula y 1 dígito.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Confirmar Contraseña</label>
            <input type="password" class="form-control" id="exampleInputPassword1"
            value={this.state.newPassword}  name="newPassword" placeholder="Confirmar Contraseña" onChange={(e) => this.handleInputChange(e)}></input>
          </div>
          {/* <Link to='/login/userdata'> */}
            <button class="btn btn-primary btn-sm" onClick={(e) => this.validateNew(e)} type="submit">Continuar</button>   
          {/* </Link> */}
          {/* {this.props.redirect ? <UserData /> : null} */}
        </form>                         
      </div>
    )}
    else{return <UserData />}
  }
}

const mapStateToProps = state => {		
  return {		
    newUser: state.newUser,
    redirect:state.redirect
  }		
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: (email,password)=>dispatch(addUser(email,password)),
    setRedirect:(state) => dispatch(setRedirect(state))
  }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(NewUser);