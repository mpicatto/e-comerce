import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setRedirectOff, completeOrder, setRedirect} from "../actions/index"
import style from './mailingAddr.module.css'

export  class MailingAddress extends React.Component {
constructor(props){
    super(props);
    this.state={}
  }

  componentDidMount(){
      this.setState({
          nombre:this.props.user.nombre,
          apellido:this.props.user.apellido,
          calle:this.props.user.calle,
          numero:this.props.user.numero,
          departamento:this.props.user.departamento,
          localidad:this.props.user.localidad,
          provincia: this.props.user.provincia
      })
  }
  //MANEJO DEL ESTADO DE LOS INPUTS
  handleInputChange(e){
    this.setState({[e.target.name]:e.target.value})
}

//FUNCION QUE GUARDA LOS DATOS DEL USUARIO
async saveData(e){
  e.preventDefault()
  if (this.state.calle && this.state.numero && this.state.localidad){
    const instance = axios.create({
        withCredentials: true
      })
      let fullname = this.state.nombre + " " + this.state.apellido
      let data = this.state.calle+" "+this.state.numero+" "+this.state.departamento+", "+this.state.localidad+", "+this.state.provincia
      let motivo = ""
      
      await this.props.completeOrder(this.props.newOrderID,"procesando",data)
      await instance.get("http://localhost:3001/submit?email="+this.props.user.email+"&direccion="
      +data+"&nombre="+fullname+"&orderID="+this.props.newOrderID+"&status=confirmar")
      .then(res=>{
        alert("La Orden esta siendo procesada, su compra sera despachada a la brevedad")
      })
      .catch(err =>{
        alert("hubo un error")
      })
      this.props.setRedirect(true)
  }else(alert("Complete la dirección de envio para completar la compra"))
} 



  render () {
    return (
      <div >
        <form className={style.form}>
            <h3>Confirmar Datos de Envio</h3>
          <label for="exampleInputEmail1" >Nombre</label>
          <input class="form-control" type="text" name="nombre" 
          value={this.props.user.nombre} onChange={(e) => this.handleInputChange(e)}
          ></input>
          <label for="exampleInputEmail1">Apellido</label>
          <input class="form-control" type="text" 
          name="apellido" value={this.props.user.apellido} 
          onChange={(e) => this.handleInputChange(e)}></input> 
          <label for="exampleInputEmail1">Direccion</label>
          <input class="form-control" type="text" name="calle"
           placeholder={this.props.user.calle} onChange={(e) => this.handleInputChange(e)}></input>  
          <label for="exampleInputEmail1">Numero</label>
          <input class="form-control" type="text" name="numero"
          placeholder={this.props.user.numero} onChange={(e) => this.handleInputChange(e)}></input> 
          <label for="exampleInputEmail1">Departamento</label>
          <input class="form-control" type="text" name="departamento" 
          placeholder={this.props.user.departamento} onChange={(e) => this.handleInputChange(e)}></input> 
          <label for="exampleInputEmail1">Localidad</label>
          <input class="form-control" type="text" name="localidad" 
          placeholder={this.props.user.localidad} onChange={(e) => this.handleInputChange(e)}></input> 
          <label for="exampleInputEmail1">Provincia</label>
          <input class="form-control" type="text" name="provincia"
          placeholder={this.props.user.provincia} onChange={(e) => this.handleInputChange(e)}></input> 
          <br></br>
          <button class="btn btn-success" onClick={(e)=>this.saveData(e)}>Confirmar Compra</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRedirect:(status)=>dispatch(setRedirect(status)),
    setRedirectOff:() => dispatch(setRedirectOff()),
    completeOrder:(id,estado,data)=>dispatch(completeOrder(id,estado,data))

  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    newOrderID: state.newOrderID
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MailingAddress);

