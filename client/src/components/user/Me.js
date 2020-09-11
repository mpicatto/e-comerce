import React from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import style from "./stilo.module.css"

export default class Me extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount(){
    const instance = axios.create({
      withCredentials: true
    })
    instance.get("http://localhost:3001/users/me")
      .then(res => {
        this.setState({
          nombre:res.data.nombre,
          apellido:res.data.apellido,
          calle:res.data.calle,
          numero:res.data.numero,
          departamento:res.data.departamento,
          localidad:res.data.localidad,
          provincia:res.data.provincia,
          email:res.data.email,
          telefono1:res.data.telefono1,
          telefono2:res.data.telefono
        })
      })
  }

  render() {
    return (
      <div className={style.form}>
      <div className="card-body">
        <h4> Detalle del Usuario </h4>
        <Link to={`/me/orders`}> <span> Mis órdenes </span></Link>
      </div>
        <ul className="list-group lista">
          <li className="list-group-item item">Nombre: {this.state.nombre}</li>
          <li className="list-group-item item">Apellido: {this.state.apellido}</li>
          <li className="list-group-item item">Calle: {this.state.calle}</li>
          <li className="list-group-item item">Número: {this.state.numero}</li>
          <li className="list-group-item item">Departamento: {this.state.departament}</li>
          <li className="list-group-item item">Localidad: {this.state.localidad}</li>
          <li className="list-group-item item">Provincia: {this.state.provincia}</li>
          <li className="list-group-item item">Email: {this.state.email}</li>
          <li className="list-group-item item">Teléfono Celular: {this.state.telefono1}</li>
          <li className="list-group-item item">Teléfono Hogar/Trabajo: {this.state.telefono2}</li>
        </ul>

        </div>
    )
  }
}
