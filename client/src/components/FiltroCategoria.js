import React from "react";
import {Link, Route} from 'react-router-dom';
import Product from "./Product.js";
import CategoryCard from "./CategoryCard.js";
import {getProductsFromCategory} from '../actions/index.js';
import { connect } from "react-redux";
import './global.css';


class FiltroCategoria extends React.Component{

    componentDidMount(){
      const { match: { params: { id }}} = this.props;
      this.props.getProductsFromCategory(id);
    }

    render () {
        return(
            <div class="catalog row">
                {this.props.products && this.props.products.map(item => <Product
                 image={item.image}
                 id={item.id}
                 name={item.name}
                 description={item.description}
                 price={item.price}
                 stock={item.stock}
                 />)}
            </div>
        )
    }

}

function mapStateToProps(state) {
  return {
    products: state.products
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProductsFromCategory: (id) => dispatch(getProductsFromCategory(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltroCategoria);
