import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import { getCategories} from '../actions/index';
import style from "../components/user/stilo.module.css";

export class NewCategoryForm extends React.Component {

  constructor(props) {
      super(props);
        this.state={category:{}}
  }
  componentDidMount () {
    this.props.getCategories()
  }

  handleInputChange (e) {
    this.state.category[e.target.name]= e.target.value;
  }

  saveCat(){
    console.log(this.state.category)
    axios.post(`http://localhost:3001/categories`,this.state.category)
    .then(res => {
      if(res.status === 200){
        alert("CATEGORIA GUARDADA CORRECTAMENTE");
      }
    })

  }

  render () {
    return (
     <div>
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


      <form class={style.form} >
                  
        <div>
          <label>Nombre:</label>		
	        <input name="name" type="text" class="form-control" id="exampleInputEmail1"
          onChange={(e) => this.handleInputChange(e) }>		
			     </input>
        </div>

        <div className = "divForm">
          <label>Descripción:</label>
          <input name="description" type="text" class="form-control" id="exampleInputEmail1"
            onChange={(e) => this.handleInputChange(e) }>		
            </input>
        </div>
        <br></br>
        
        <button type="button" class="btn btn-success" onClick={(e) => {
        e.preventDefault()
        this.saveCat() }}> Guardar </button>
       <br></br>
       <br></br>
          <Link to={"/products/"+this.props.productDetail.id}>
              <span> Volver al producto </span>
          </Link>
      </form>
    </div>   
    )
    }

}
const mapStateToProps = state => {		
  return {		
    productDetail: state.productDetail,		
    categories:state.categories		
  }		
}		
const mapDispatchToProps = dispatch => {
  return {
    getCategories: () => dispatch(getCategories()),

  }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(NewCategoryForm);
