import React from 'react';
import axios from 'axios';
import {getCategories,cleanProductDetail } from '../actions/index';		
import { connect } from 'react-redux';		
import {Link} from "react-router-dom";
import style from "../components/user/stilo.module.css";

class FormProduct extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        selectedFile: false,
        data:{path:"0"}
      }
  }

  componentDidMount () {
    this.props.getCategories()
    if(this.props.productCategories){		
      	      // console.log(this.props.productCategories)		
      	      this.props.productDetail.categoryId=[]		
      	      this.props.productCategories.map(item=>{		
      	        this.props.productDetail.categoryId.push(item.id.toString())		
      	      })		
      	      // console.log(this.props.productDetail.categoryId)		
      	    }
  }

  cleanStore(){
    this.props.cleanProductDetail()
  }

  handleInputChange (e) {

    this.props.productDetail[e.target.name] = e.target.value;
  }

  handleInputChangeCategory(e){		
    	    let array = this.props.productDetail.categoryId		
    	    let flag = true		
    	    array.forEach((id,i) => {		
    	      if (id == e.target.value){		
    	        array.splice(i,1)		
    	        flag = false		
    	        return		
    	      }		
    	    })		
    	    if(flag){		
    	      this.props.productDetail.categoryId.push(e.target.value)		
          }			
         }

    fileSelected(e){
    e.preventDefault()
    console.log(e.target.files)
    this.state["selectedFile"]=e.target.files[0]

      }     

      uploadHandler(e){
        e.preventDefault()
        const instance = axios.create({
          withCredentials: true
        })
        const fd=new FormData()
        fd.append('image',this.state.selectedFile)
        instance.post('http://localhost:3001/uploads',fd)
        .then(res=>{
          if (res.status==200){
            alert("Imagen Cargada con Exito")
          }
          this.setState({data:res.data.path})
        })
      }          

      save(){
        const instance = axios.create({
          withCredentials: true
        })
        console.log("save")
        this.props.productDetail["image"]=this.state.selectedFile.name
        instance.post(`http://localhost:3001/products`, this.props.productDetail)
          .then(async res => {
            if(await res.status === 200){
              alert("PRODUCTO GUARDADO CORRECTAMENTE");
            }else {alert("hubo un error!!!")
            }
          })
          .then(res=>{window.location.reload(false);})
        }
        modify(){
          const instance = axios.create({
            withCredentials: true
          })
          console.log("modify")
          this.props.productDetail["image"]=this.state.selectedFile.name
          instance.put(`http://localhost:3001/products/${this.props.productDetail.id}`,
           this.props.productDetail)
            .then(async res => {
              if(res.status === 201){
                await alert("PRODUCTO GUARDADO CORRECTAMENTE");
              } else {alert("hubo un error!!!")
              console.log(res);}
            })
            .then(res=>{window.location.reload(false);})
        }
        delete(){
          const instance = axios.create({
            withCredentials: true
          })
          instance.delete(`http://localhost:3001/products/${this.props.productDetail.id}`,
           this.props.productDetail)
            .then(async res => {
              if(res.status === 200){
                await alert("PRODUCTO BORRADO CORRECTAMENTE");
              } else {alert("hubo un error!!!")
              console.log(res);}
            })
            .then(res=>{window.location.reload(false);})
        } 
    

    render () {

      return (
        <div>
        <div class={`btn-group ${style.margen}`} role="group" aria-label="Basic example">
    
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
          
        <form class={style.form}>
          <div className = "divForm">
            <label> Nombre: </label>
            <input type="text" name="name" class="form-control" id="exampleInputPassword1" 
            placeholder={this.props.productDetail && this.props.productDetail.name} 
            
            onChange={(e) => this.handleInputChange(e)} />
          </div>
           <div className = "divForm">
            <label>Categoría:</label>
             
                {this.props.categories && this.props.categories.map(category => {
                  let checked = false
                  this.props.productCategories.map(product_Category => {
                    if (category.name === product_Category.name && this.props.productDetail.id){
                      checked=true; 
                      return 
                    }
                  })
                  return (<div>
                    <input type="checkbox" 
                    value = {category.id}
                    defaultChecked = {checked}		

	                onChange={(e) => this.handleInputChangeCategory(e)}/>
                    <label> {category.name} </label>
                    </div>)})}
             
          </div>
          <Link to="/form_categories">
          <button ttype="button" class="btn btn-success btn-sm">Editar Categorias</button>
          </Link>
          <div className = "divForm">
            <label>Descripción:</label>
            <input type="text" name="description" class="form-control" id="exampleInputPassword1" placeholder={ this.props.productDetail.description} onChange={(e) => this.handleInputChange(e)}  />
          </div>
          <div className = "divForm">
            <label>Precio:</label>
            <input type="text" name="price" class="form-control" id="exampleInputPassword1" placeholder={this.props.productDetail && this.props.productDetail.price} onChange={(e) => this.handleInputChange(e)}  />
          </div>
          <div className = "divForm">
            <label>Stock:</label>
            <input type="text" name="stock" class="form-control" id="exampleInputPassword1" placeholder={this.props.productDetail && this.props.productDetail.stock} onChange={(e) => this.handleInputChange(e)}  />
          </div>
          {/* --------------------------------------Image Uploader--------------------------- */}
            <div>
              <input type="file" class="btn-sm" onChange={(e)=>this.fileSelected(e)}/>
               &nbsp;
              <button type="button" class="btn btn-success btn-sm" onClick={(e)=>this.uploadHandler(e)}>Cargar Imagen</button>
            </div>
              <br></br>
                    
        
          {/* {this.state.data.path !=="0" ?<div><img src={"http://localhost:3001"+this.state.data.path} /></div>:null} */}
              
          {/* ------------------------------------------------------------------------------------ */}

          <input id= "botonBorrar" type="button" class="btn btn-danger btn-sm" type='submit' value="Borrar" onClick={(e) => {
          e.preventDefault();
          this.cleanStore()
          this.delete() }}/>
          &nbsp;  {/* ESPACIO HORIZONTAL */}
          <input id= "botonGuardar" type="button" class="btn btn-success btn-sm" value="Guardar" onClick={(e) => {
          e.preventDefault();
          if (this.props.productDetail.id){
            this.modify()
            return;
          }
          this.save() }}/>
          &nbsp;
          <Link to={"/products/"+this.props.productDetail.id}>		
          <span>Volver a Producto</span>		
	        </Link>		
        </form>
      </div>  
      )
  
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      getCategories: () => dispatch(getCategories()),
      cleanProductDetail: () => dispatch(cleanProductDetail())
    }
  }
  
  const mapStateToProps = state => {
    return {
      productDetail: state.productDetail,
      categories:state.categories,
      productCategories:state.productCategories
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FormProduct);
  