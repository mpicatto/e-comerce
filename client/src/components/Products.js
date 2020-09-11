import React, { Component } from 'react';
import { connect } from "react-redux";
import Product from './Product.js';
import './global.css';

 //se borro el getProducts no usado

export class Products extends Component {

  render() {
    return (
      <div className="catalog row">
        {this.props.products && this.props.products.map(item =>
          {
          if (item.stock>0) {
            return <Product
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              stock={item.stock}
              image={item.image}
            />
          }})
        }
      </div>
    );
  }
}

//Funciones que mapean al store
function mapStateToProps(state) {
  return {
    products: state.products
  };
}


export default connect(mapStateToProps)(Products);
