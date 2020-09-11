import React, { Component } from "react";
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import { cleanProductDetail } from "../actions";
import style from './user/stilo.module.css'

export class Admin extends Component {

  componentDidMount(){
   this.props.cleanProductDetail()
  }

render(){

      return(
        <div class={`btn-group ${style.margen}`} role="group" aria-label="Basic example">
            <Link to="/form_product">
              <button  type="button" class="btn btn-secondary btn-sm" >Nuevo producto</button>
            </Link>
              &nbsp;
            <Link to="/new_category_form">
              <button  type="button" class="btn btn-secondary btn-sm" name="Categoria" >Nueva categoría</button>
            </Link>
             &nbsp;
            <Link to="/login/userlist">  
              <button  type="button" class="btn btn-secondary btn-sm" name="Lista" >Lista Usuarios</button>
            </Link>
             &nbsp;
            <Link to="/orders">  
              <button  type="button" class="btn btn-secondary btn-sm" name="Ordenes" >Lista Ordenes</button>
            </Link>
        </div>
      )
    }

  }   
  const mapDispatchToProps = dispatch => {
    return {
      cleanProductDetail:() => dispatch(cleanProductDetail())
  
    }
  }

  export default connect(null, mapDispatchToProps)(Admin);
   