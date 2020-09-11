import React from 'react';
import { connect } from 'react-redux';
import {setPassword} from '../../actions/index';
import style from "./stilo.module.css"

//Nuevo Componente, Es el formulario de una nueva contraseña 
//cuando un admin lepida a un usuario que cambie la misma

export  class PwdReset extends React.Component {
    constructor(props) {
        super(props);
          this.state = {
              pwd: "",
              confirmPwd:""
          }
      }
    resetPassword(e){
        e.preventDefault()
        if (this.state.pwd === this.state.confirmPwd && /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(this.state.pwd)){
        this.props.setPassword(this.props.user.id,this.state.pwd);
      } else {alert ("Las contraseñas no coinciden")}
    }

    handleInputChange (e) {
        this.setState({
          [e.target.name]: e.target.value
        })
      }

    render () {
        return (
            <div>
                <form class={style.form}>
                   <div>
                    <label>Contraseña Nueva: </label>
                    <input name="pwd" type="password"   class="form-control" id="exampleInputPassword1" value={this.state.pwd} onChange={(e) => this.handleInputChange(e) }></input>
                   </div> 
                   <div>
                    <label>Confirmar Contraseña: </label>
                    <input name="confirmPwd" type="password" class="form-control" id="exampleInputPassword1" value={this.state.confirmPwd} onChange={(e) => this.handleInputChange(e) }></input>
                   </div> 
                   <br></br>
                   <button class="btn btn-primary btn-sm"  onClick={(e)=>this.resetPassword(e)}>Guardar</button>
                </form>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        setPassword: (id,pwd) => dispatch(setPassword(id,pwd))
    }
  }
  
  const mapStateToProps = state => {
    return {
        user:state.user
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(PwdReset);