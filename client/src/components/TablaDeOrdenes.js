import React, { Component} from 'react';
import { connect } from "react-redux";
import {getOrders, getProductsFromOrder, completeOrder} from '../actions/index';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from "./user/stilo.module.css"

export class TablaDeOrdenes extends Component {


  componentDidMount(){
    let condition = "todas"
    this.props.getOrders(condition);
    this.props.getProductsFromOrder();
  }


  filterByCondition(e){
    let condition = e.target.value
    this.props.getOrders(condition)
  }

  async changeStatus(id,estado,direccion,nombre,apellido,email){
    let data = direccion
    this.props.completeOrder(id,estado,data);
    console.log(estado)
    const instance = axios.create({
      withCredentials: true
    })
    let fullname = nombre + " " +apellido

    await instance.get("http://localhost:3001/submit?email="+email+"&direccion="
      +data+"&nombre="+fullname+"&orderID="+id+"&status="+estado)
      .then(res=>{
        alert("Orden Modificada")
      })
      .catch(err =>{
        alert("hubo un error")
      })
    window.location.reload()

  }

  calculoTotalOrden (products) {
    var totalDeOrden = 0;
    if(products !== []){
      products.map( e => {
        totalDeOrden = totalDeOrden + (e.order_line.price * e.order_line.cantidad)
      })
    }
    return totalDeOrden;
  }

  render() {
    return (
      <div className={style.form}>
      <div className="form">
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
        </div>
        <br></br>
      <div className="divroot">
        <h5 className="texto-tierra shadowsIntoLight"> Órdenes </h5>
        <div>
        <p>Filtrar Ordenes por Estado:</p>
        <button class="btn btn-secondary btn-sm" value="procesando" onClick={(e)=>this.filterByCondition(e)}>Procesando</button>
         &nbsp;  
        <button class="btn btn-secondary btn-sm" value="enviada" onClick={(e)=>this.filterByCondition(e)}>Enviada</button>
          &nbsp;  
        <button class="btn btn-secondary btn-sm" value="cancelada" onClick={(e)=>this.filterByCondition(e)}>Cancelada</button>
          &nbsp;  
        <button class="btn btn-secondary btn-sm" value="completada" onClick={(e)=>this.filterByCondition(e)} >Completada</button>
          &nbsp;  
        <button class="btn btn-secondary btn-sm" value="todas" onClick={(e)=>this.filterByCondition(e)}>Todas</button>
      </div>
     {/* <div>
        <p>Filtrar por número de Orden:</p>
        <div>
        <p>Orden Nº:</p>
        <input type="number" />
        <button>Buscar</button>
        </div>
      </div> */}
        <div className="catalogCarrito row">

        {this.props.ordenes.length===0 ? <h5>No existen ordenes para el estado seleccionado</h5>:null}

         {/*Se muestran todas las órdenes cuando sos Admin y se muestran solo tus órdenes, cuando sos usuario*/}
          {this.props.ordenes && this.props.ordenes.filter(el => this.props.user.isAdmin || this.props.user.id === el.userId).map((el,i) =>
            <div className={style.form}>
            <div className="form">
                <h5 className="texto-tierra shadowsIntoLight">Número de órden: {el.id}</h5>
                <h5 className = "text">Usuario: {el.user.nombre} {el.user.apellido}</h5>
                <h5 className = "text">Estado: {el.estado}</h5>
                <h5 className = "text">Fecha: {el.createdAt}</h5>
                <h5 className = "text">Total a pagar $ {el.products && this.calculoTotalOrden(el.products)}</h5>
                {this.props.user.isAdmin && el.estado === "procesando" ||el.estado==="enviada" ? <button type="button" class="btn btn-danger btn-sm" onClick={(e)=>this.changeStatus(el.id,"cancelada",el.direccion,el.user.nombre,el.user.apellido,el.user.email)}>Cancelar</button>:null}
                  &nbsp; {/*AGREGA UN ESPACIO EN UNA MISMA LINEA HORIZONRA*/}
                {this.props.user.isAdmin && el.estado === "procesando" ? <button type="button" class="btn btn-success btn-sm" onClick={()=>this.changeStatus(el.id,"enviada",el.direccion,el.user.nombre,el.user.apellido,el.user.email)}>Despachar</button>:null}
                {this.props.user.isAdmin && el.estado === "enviada" ? <button type="button" class="btn btn-success" onClick={()=>this.changeStatus(el.id,"completada",el.direccion,el.user.nombre,el.user.apellido,el.user.email)}>Completar</button>:null}
                {this.props.user.isAdmin && el.estado === "enviada" ? <button type="button" class="btn btn-success btn-sm" onClick={()=>this.changeStatus(el.id,"procesando",el.direccion,el.user.nombre,el.user.apellido,el.user.email)}>Re-Procesar</button>:null}
                <br></br>
                {/*Si es admin muestra todos los productos de una orden de cualquier usuario*/}
                {this.props.user.isAdmin && <Link to={`/orders/${el.id}/products`}>
                <span onClick={() => this.props.getProductsFromOrder(el.id)}> Productos </span>
                <br></br>
                </Link>}

                {/*Si es el usuario logueado muestra todos los productos de su orden*/}
                {!this.props.user.isAdmin  && <Link to={`/me/orders/products`}>
                <span onClick={() => this.props.getProductsFromOrder(el.id)}> Productos </span>
                </Link>}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    )
  }
}
//Funciones que mapean al store
function mapStateToProps(state) {
  return {
    ordenes: state.ordenes,
    productsFromOrder: state.productsFromOrder,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    completeOrder: (id,estado,data) => dispatch(completeOrder(id,estado,data)),
    getOrders: condition => dispatch(getOrders(condition)),
    getProductsFromOrder: (id) => dispatch(getProductsFromOrder(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TablaDeOrdenes);
