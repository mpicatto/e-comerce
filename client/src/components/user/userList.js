import React, { Component } from 'react';
import UserCard from './userCard.js';
import axios from 'axios';
import {Link} from "react-router-dom";
import style from "./stilo.module.css"

export default class Userlist extends Component {
    constructor(){
        super();
        this.state = { userlist:[]
        }
    }

componentDidMount(){
  axios.get("http://localhost:3001/admin",{withCredentials:true})
    .then(user =>{
      let array=[];
        user.data.map(item =>{
      //this.state.userlist.push(item)})})
          if(item.activo) array.push(item);
        })
        this.setState({userlist:array});
    })
      return;
      //console.log(this.state.userlist)
}


  render() {
    return (
      <div className={style.form}>
        <div className="btn-group" role="group" aria-label="Basic example">
          <Link to="/form_product">
            <button  type="button" class="btn btn-secondary" >Nuevo producto</button>
          </Link>
          <Link to="/new_category_form">
            <button  type="button" class="btn btn-secondary" name="Categoria" >Nueva categoría</button>
          </Link>
          <Link to="/orders">  
            <button  type="button" class="btn btn-secondary" name="Ordenes" >Lista Ordenes</button>
          </Link>
        </div>
        <div className={style.form}>
            {this.state.userlist && this.state.userlist.map(item =>
              { console.log(item)
            return < UserCard
            id={item.id}
            email= {item.email}
            nombre={item.nombre}
            apellido={item.apellido}
            calle={item.calle}
            numero={item.numero}
            departamento={item.departamento}
            localidad={item.localidad}
            provincia={item.provincia}
            telefono1={item.telefono1}
            telefono2={item.telefono2}
                  />})
              }
        </div>
      </div>
    );
  }
}
