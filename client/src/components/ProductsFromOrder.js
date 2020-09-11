import React from 'react';
import { connect } from 'react-redux';
import { getProductsFromOrder } from '../actions/index';
import {Link,Route} from "react-router-dom";
import style from "./user/stilo.module.css"


class ProductsFromOrder extends React.Component {

  constructor(props){
    super(props);
  }

/*  componentDidMount(){
    this.props.getProductsFromOrder(this.props);
  }*/

  render() {
    return (
      <div>
        <div className={style.form}>
          <h2 className = "text"> Detalle </h2>
            <div className="container">
              <img className="foto" src="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
            </div>
            <div className="container" >
            {
              this.props.productsFromOrder.id && this.props.productsFromOrder.products.map((el,i) => (
                <div>
                  <h4>{el.name}</h4>
                  <h5>IMAGEN</h5>
                  <h5>Precio $ {el.order_line.price}</h5>
                  <h5>Cantidad {el.order_line.cantidad}</h5>
                  <h5>Total $ {el.order_line.price * el.order_line.cantidad}</h5>
                  <Link to={`/products/${el.id}`}>
                  <span>Detalle del producto</span>
                  </Link>
                </div>
              ))
            }
            </div>
          </div>
        </div>
      )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProductsFromOrder: (id) => dispatch(getProductsFromOrder(id))
  }
}

const mapStateToProps = state => {
  return {
    ordenes: state.ordenes,
    productsFromOrder: state.productsFromOrder
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductsFromOrder);
