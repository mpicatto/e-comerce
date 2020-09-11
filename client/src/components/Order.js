import React, { Component } from "react";
import { connect } from "react-redux";
import { increment,decrement,removeProductFromCart, getProductsCart, completeOrderUser,
newOrderID, setRedirect, setRedirectOff} from "../actions/index";
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import MailingAddress from './mailingAddr'
//import style from "../components/user/stilo.module.css";
import style from './order.module.css';

//COMPONENTE ORDER
export class Order extends Component {
  constructor(props){
    super(props)
    this.state = {
      products:[]
    }
  }

  //SWEET ALERT PARA CONFIRMAR SI UN PRODUCTO SE QUIERE O NO SACAR DEL CARRITO
  mostrarAlerta(indice) {
    swal ({
      title: "¿Desea eliminar este producto?",
      icon: "warning",
      buttons: ["No" ,  "Si!"],
      dangerMode: true,

      //USAR WILLDELETE SINO NO RECONOCE ESE TIPO DE SWEET ALERT
    }).then(willDelete => {
      if(willDelete){
        if (this.props.user.id === 0) {
        this.props.removeProductFromCart(this.props.user.id, this.props.order.products[indice].productId)
        } else {
        this.props.removeProductFromCart(this.props.user.id, this.props.order.products[indice].id)}
        swal({text: "El articulo se elimino correctamente eliminado", icon: "success"})
        return;
      }
    });
  }

  //TRAE EL CARRITO DE UN USUARIO.. LO PRECARGA Y LO DEJA EN EL STORE DE REDUX
  componentDidMount(){
    if (this.props.user.id != 0){
      this.props.getProductsCart(this.props.user.id);
    }
    this.props.setRedirect(true)
  }

  componentWillUnmount(){
    this.props.setRedirectOff()
  }

  //FUNCION QUE CALCULA EL TOTAL DE LA COMPRA
  calculoTotal (products) {
    var totalDeOrden = 0;
    if (this.props.user.id !=0){
      products.map( e => {
        totalDeOrden = totalDeOrden + (e.order_line.price * e.order_line.cantidad)
      })
      return totalDeOrden;
    } else {
      products.map( e =>{
        totalDeOrden = totalDeOrden + (Number(e.price) * Number(e.cantidad));
      })
      return totalDeOrden;
    }
  }

  vaciarCarrito(order){
    swal({
      title: "¿Desea vaciar el carrito?",
      icon: "warning",
      buttons: ["No","Sí"],
      dangerMode: true
    }).then(willDelete=>{
      if(willDelete){
        axios.delete("http://localhost:3001/users/"+ this.props.user.id +"/cart")
      .then(async res=>{
        await swal({text: "Carrito vacío",icon:"error"});
      })
      .then(res=>{window.location.reload(false);})
     }
    })
    //MANEJO DE EERORES
    .catch(err=>{
      alert(err)
    })

  }

  async orderToProcess(){
    await this.props.newOrderID(this.props.order.id)
    await this.props.completeOrderUser(this.props.order.id)
    this.props.setRedirectOff()
  }


  render() {
    if (this.props.user.id ===0){
      return(
        <div className={style.form}>
          <div>
            {/* MUESTRA EL TOTAL! del guest */}
            <h5 className={style.total}> Total a pagar $ {this.props.order.products[0] && this.calculoTotal(this.props.order.products)}</h5>
          </div>

          <div className={`row ${style.catalog}`}>


            {/* MAPEA LOS PRODUCTOS DEL CARRITO */}
            {this.props.order.products[0] && this.props.order.products.map((el,i) => (
            <div className={`card col-2 ${style.color}`}>
              <div className="card-body">
                <img className= "card-img-top foto" src="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />

                {/* DETALLE DEL PRODUCTO */}
                <Link to = {'/products/' + el.productId }><h2 className={`card-title ${style.title}`}>{el.name}</h2></Link>

              </div>
              {/* PRECIO UNITARIO */}
              <h5 className={`card-text ${style.text}`}>Precio $ {el.price}</h5>

              {/* CANTIDAD DEL PRODUCTO */}
              <h5 className={`card-text ${style.text}`}> Cantidad {el.cantidad}</h5>
              <div className="card-body">
              {/* BOTONES DECREMENTAR E INCREMENTAR */}
              <button type="button" className={`btn btn-success btn-sm ${style.borde}`} onClick={() => this.props.decrement(this.props.user.id, el.productId)}>-</button>
              <button type="button" className={`btn btn-success btn-sm ${style.borde}`} onClick={() => this.props.increment(this.props.user.id, el.productId)}>+</button>
              </div>
              {/*TOTAL DEL COSTO DE UN PRODUCTO */}
              <h5 className={`card-title ${style.title}`}> Total $ {el.cantidad*Number(el.price)}</h5>

              {/* BORRA EL PRODUCTO SELECCIONADO */}
              <button type="button" className={`btn btn-danger ${style.vaciarCarrito}`} onClick={() => this.mostrarAlerta(i)}> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg> </button>



            </div>
            ))}
            {/* BOTON PARA QUE EL USUARIO FINALICE LA COMPRA.. LLAMA A UNA FUNCION PARA MODIFICAR LA ORDEN! */}
            {this.props.order.products && this.props.order.products.length > 0 ?  <Link to="/login">
            <span type="button" className={`btn btn-success ${style.llenarCarrito}`} onClick={()=>this.orderToProcess()}>Finalizar compra</span>
            </Link>:null}
            
          </div>
          {/* BOTON PARA QUE EL USUARIO FINALICE LA COMPRA.. LLAMA A UNA FUNCION PARA MODIFICAR LA ORDEN! */}
          {this.props.order.products.length ? <button onClick={()=>this.orderToProcess()}>Finalizar compra</button>:null}
        </div>

      )


    }

    if (!this.props.redirect){
      return <MailingAddress />
    }

    else {

      return (
      <div className={style.form}>
        <div>

         {/* MUESTRA EL TOTAL! */}
          <h5 className={style.total}> Total a pagar $ {this.props.order.products && this.calculoTotal(this.props.order.products)}</h5>
        </div>

        <div className={`row ${style.catalog}`}>

        {/* MAPEA LOS PRODUCTOS DEL CARRITO */}
        {this.props.order.products && this.props.order.products.map((el,i) => (
          <div className={`card col-2 ${style.color}`}>
            <div className="card-body">

              <img className= "card-img-top foto" src="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />

              {/* DETALLE DEL PRODUCTO */}
              <Link to = {'/products/' + el.id }><h2 className={`card-title ${style.title}`}>{el.name}</h2></Link>

              {/* PRECIO UNITARIO */}
              <h5 className={`card-text ${style.text}`}>Precio $ {el.order_line.price}</h5>

              {/* CANTIDAD DEL PRODUCTO */}
              <h5 className={`card-text ${style.text}`}>Cantidad {el.order_line.cantidad}</h5>
              <div className="card-body">
               {/* BOTONES DECREMENTAR E INCREMENTAR */}
                <button type="button" className={`btn btn-success btn-sm ${style.borde}`} onClick={() => this.props.decrement(this.props.user.id, el.id)}>-</button>
                <button type="button" className={`btn btn-success btn-sm ${style.borde}`} onClick={() => this.props.increment(this.props.user.id, el.id)}>+</button>
              </div>
              {/* TOTAL UNITARIO */}
              <h5 className={`card-title ${style.title}`}>Total $ {el.order_line.price * el.order_line.cantidad}</h5>
                <br></br>
                {/* BORRA EL PRODUCTO SELECCIONADO */}
                <button type="button" className={`btn btn-danger ${style.vaciarCarrito}`} onClick={() => this.mostrarAlerta(i)}> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg> </button>

            </div>
          </div>
          ))
        }
      </div>
      <br></br>
      {/* BOTON PARA QUE EL USUARIO FINALICE LA COMPRA.. LLAMA A UNA FUNCION PARA MODIFICAR LA ORDEN! */}
      {this.props.order.products && this.props.order.products.length > 0 ? <button type="button" className={`btn btn-success ${style.llenarCarrito}`} onClick={()=>this.orderToProcess()}>Finalizar compra</button>:null}
      &nbsp;
      {/* Boton para vaciar el carrito */}
      <button type="button" className={`btn btn-danger ${style.vaciarCarrito}`}>
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e)=>this.vaciarCarrito(e)}>
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </button>

    </div>
    );
  }
  }
}



function mapStateToProps(state) {
  return {
    order: state.order,
    user: state.user,
    redirect:state.redirect
  };
}

function mapDispatchToProps(dispatch) {
   return {
    getProductsCart: id => dispatch(getProductsCart(id)),
    removeProductFromCart: (id, prodId) => dispatch(removeProductFromCart(id, prodId)),
    decrement: (id, prodId) => dispatch(decrement(id, prodId)),
    increment: (id, prodId) => dispatch(increment(id, prodId)),
    completeOrderUser:(id)=>dispatch(completeOrderUser(id)),
    newOrderID: (orderID) => dispatch(newOrderID(orderID)),
    setRedirect:(state)=> dispatch(setRedirect(state)),
    setRedirectOff:()=>dispatch(setRedirectOff())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order);
