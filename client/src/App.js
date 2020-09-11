import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Products from './components/Products.js';
import FormProduct from './components/FormProduct.js';
import NewCategoryForm from './components/NewCategoryForm.js'
import FormCategories from './components/FormCategories.js'
import ProductDetail from "./components/ProductDetail.js";
import Categories from './components/Categories.js';
import FiltroCategoria from './components/FiltroCategoria.js';
import Nav from './components/Nav.js';
import Order from './components/Order.js';
import Landing from './components/Landing.js';
import {Route} from 'react-router-dom';
import { getProducts,getProductsByName } from './actions/index';
import { connect } from "react-redux";
import UpdateUser from './components/user/UpdateUser';
import NewUser from './components/user/NewUser';
import UserDetail from './components/user/userDetail'
import Login from './components/user/Login';
import UserList from './components/user/userList'
import Admin from "./components/Admin";
import TablaDeOrdenes from './components/TablaDeOrdenes.js';
import ProductsFromOrder from './components/ProductsFromOrder.js';
import PwdReset from "./components/user/PwdReset.js";
import {Redirect} from 'react-router';
import Me from './components/user/Me.js';

class App extends React.Component{
  constructor(){
    super();
      this.onSearch = (product) => {
      this.props.getProductsByName(product)
    }
  }
  componentDidMount(){
    this.props.getProducts();
  }

//  nuevo render, en caso de que un usuario o guest entre a una ruta que no deberia, se redirigira al inicio
//  y en caso de que se le pida a un usuario un reseteo de su password sera redirigido al formulario de la misma
render(){
  return (
    <div>

      {/* Rutas para todos */}

      <Route path='/' render={() => <Nav onSearch={this.onSearch}/>}/>
      <Route exact path='/'component={Landing} />

      <Route exact path='/products' component={Products} />
      <Route exact path='/products/:id' component = {ProductDetail}/>

      <Route exact path='/categories'component={Categories} />
      <Route exact path='/category/:id' component = {FiltroCategoria}/>




      {/*---------------------------------------------------------------*/}


      {/*Redireccion de las rutas del Admin*/}

      <Route exact path='/admin'>
        {this.props.user.isAdmin ? <Admin/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/new_category_form'>
        {this.props.user.isAdmin ? <NewCategoryForm/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/form_categories'>
        {this.props.user.isAdmin ? <FormCategories/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/form_product'>
        {this.props.user.isAdmin ? <FormProduct/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/orders'>
        {this.props.user.isAdmin ? <TablaDeOrdenes/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/orders/:id/products'>
        {this.props.user.isAdmin ? <ProductsFromOrder/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/login/userlist'>
      {this.props.user.isAdmin ? <UserList/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/users/:id'>
        {this.props.user.isAdmin ? <UserDetail/> : <Redirect to="/"/>}
      </Route>

      {/*---------------------------------------------------------------*/}

      {/*Redireccion de las rutas del Usuario*/}
      <Route exact path='/cart/:id'>
        {this.props.user ? <Order/> : <Redirect to="/"/>}
      </Route>
      <Route exact path={window.location.pathname}>
        {this.props.user.pwdReset ?<Redirect to="/pwdReset"/>:null}
      </Route>
      <Route path='/pwdReset'>
        {this.props.user.pwdReset ? <PwdReset/>:<Redirect to= "/"/>}
      </Route>
      <Route exact path='/me'>
        {this.props.user.id ? <Me/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/me/orders'>
        {this.props.user.id ? <TablaDeOrdenes/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/me/orders/products'>
        {this.props.user.id ? <ProductsFromOrder/> : <Redirect to="/"/>}
      </Route>


      {/*---------------------------------------------------------------*/}

      {/*Rutas exclisivas para Guests(en un futuro)*/}

      <Route exact path='/login'>
      {!this.props.user.id ? <Login/> : <Redirect to="/"/>}
      </Route>
      <Route exact path='/login/newuser' component = {NewUser}/>
      <Route exact path='/login/userdata' component = {UpdateUser}/>



  </div>
  )
}

}

	const mapDispatchToProps = dispatch => {
  	  return {
  	    getProductsByName: (product) => dispatch(getProductsByName(product)),
  	    getProducts: ()=> dispatch(getProducts())
  	  }
  	}

  	const mapStateToProps = state => {
  	  return {
        productDetail: state.products,
        user: state.user
  	  }
  	}


	export default connect(mapStateToProps, mapDispatchToProps)(App);


  /*---------------------------------------------------------------*/

  // Viejo render Revisar
  // render(){
  //   return (
  //     <div>
  //       <Route path='/' render={() => <Nav onSearch={this.onSearch}/>}/>
  //       <Route exact path='/admin' render={() => <Admin onSearch={this.onSearch}/>}/>
  //       <Route exact path='/'component={Landing} />
  //       <Route exact path='/products' component={Products} />
  //       <Route exact path='/orders' component={TablaDeOrdenes} />
  //       <Route exact path='/orders/:id/products' component={ProductsFromOrder} />
  //       <Route exact path='/new_category_form'component={NewCategoryForm} />
  //       <Route exact path='/form_categories'component={FormCategories} />
  //       <Route exact path='/form_product'component={FormProduct} />
  //       <Route exact path='/categories'component={Categories} />
  //       <Route exact path='/category/:id' component = {FiltroCategoria}/>
  //       <Route exact path='/cart/:id' component = {Order}/>
  //       <Route exact path='/login' component = {Login}/>
  //       <Route exact path='/login/userdata' component = {UpdateUser}/>
  //       <Route exact path='/login/newuser' component = {NewUser}/>
  //       <Route exact path='/login/userlist' component={UserList}/>
  //       <Route exact path='/products/:id' component = {ProductDetail}/>
  //       <Route exact path='/users/:id' component = {UserDetail}/>
  //   </div>
  //   )
  // }

/*---------------------------------------------------------------*/
