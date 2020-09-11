import axios from 'axios';
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const ADD_PRODUCT_TO_CART = 'ADD_PRODUCT_TO_CART';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const REMOVE_PRODUCT_FROM_CART = 'REMOVE_PRODUCT_FROM_CART';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const SET_PRODUCT = 'SET_PRODUCT';
export const SET_CATEGORY = 'SET_CATEGORY';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCTS_BY_NAME = 'GET_PRODUCTS_BY_NAME';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_PRODUCT_CATEGORIES = 'GET_PRODUCT_CATEGORIES';
export const GET_PRODUCT_DETAIL = 'GET_PRODUCT_DETAIL';
export const CLEAN_PRODUCT_DETAIL = 'CLEAN_PRODUCT_DETAIL';
export const GET_PRODUCTS_FROM_CATEGORY = 'GET_PRODUCTS_FROM_CATEGORY';
export const GET_PRODUCTS_CART = 'GET_PRODUCTS_CART';
export const ADD_USER = 'ADD_USER';
export const SAVE_NEW_USER ='SAVE_NEW_USER';
export const GET_USER_DETAIL = 'GET_USER_DETAIL';
export const SET_REDIRECT = 'SET_REDIRECT';
export const SET_REDIRECT_OFF = 'SET_REDIRECT_OFF';
export const SET_ADMIN = 'SET_ADMIN';
export const GET_ORDERS ='GET_ORDERS';
export const GET_PRODUCTS_FROM_ORDER = 'GET_PRODUCTS_FROM_ORDER';
export const SET_USER_STATE = 'SET_USER_STATE';
export const USER_LOGOUT = 'USER_LOGOUT';
export const SET_RATING = 'SET_RATING'
export const SET_PASSWORD = "SET_PASSWORD";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const GET_REVIEWS = "GET_REVIEWS";
export const COMPLETE_ORDER = "COMPLETE_ORDER";
export const NEW_ORDER_ID = 'NEW_ORDER_ID'

const instance = axios.create({
  withCredentials: true
})

export function setProduct(payload) {  //modicamos un producto
  return { type: SET_PRODUCT, payload };
}

export function setAdmin(payload) {  //cambio a admin o usuario regular
  return { type: SET_ADMIN, payload };
}

export function addProductToCart(id, prodId, payload) { //id = userId, payload = producto
  return function(dispatch) {
    if (id === 0){
      dispatch({ type: ADD_PRODUCT_TO_CART, payload});
    } else {
      return instance.post("http://localhost:3001/users/" + id +"/cart/", payload)
      .then(json => {
        dispatch({ type: ADD_PRODUCT_TO_CART, payload});
      });
    }

  };
}

export function removeProductFromCart(id, prodId) { //eliminamos un producto del carrito de un usuario id
  return function(dispatch) { 
    if (id === 0){
      dispatch({ type: REMOVE_PRODUCT_FROM_CART, payload: prodId });
    }
    return instance.delete("http://localhost:3001/users/" + id +"/cart/" + prodId)
      .then(json => {
        dispatch({ type: REMOVE_PRODUCT_FROM_CART, payload: prodId });
      });
  };
}

export function getProducts() { //Listar productos
  return function(dispatch) {
    return instance.get("http://localhost:3001/products")
      .then(json => {
        dispatch({ type: GET_PRODUCTS, payload: json.data }); //el payload seran todos los productos que me devuelve la BD
      });
  };
}

export function getProductsByName(product) { //Listar productos
  return function(dispatch) {
    return instance.get("http://localhost:3001/products?search="+product)
      .then(json => {
        dispatch({ type: GET_PRODUCTS_BY_NAME, payload: json.data }); //el payload seran todos los productos que me devuelve la BD
      });
  };
}

export function getProductsFromCategory(id) { //Listar productos de una categoría
  return function(dispatch) {
    return instance.get("http://localhost:3001/products/category/" + id)
      .then(json => {
        dispatch({ type: GET_PRODUCTS_FROM_CATEGORY, payload: json.data }); //el payload seran todos los productos de una categoría
      });
  };
}

//ESTA RUTA ESTA PROTEGIDA DESDE EL BACK!!!!!!
export function getProductsCart(userId,payload){
  return function(dispacth){
    if (userId === 0){
      dispacth({type: GET_PRODUCTS_CART, payload})
    } else {
      return instance.get("http://localhost:3001/users/"+userId+"/cart")
    .then(res=>{
      console.log(res)
      dispacth({type: GET_PRODUCTS_CART, payload: res.data})
    })
    .catch(err=>{
      alert(err)
    })
    }

  }
}

export function getCategories() { //Listar categorías
  return function(dispatch) {
    return instance.get("http://localhost:3001/categories")
      .then(json => {
        dispatch({ type: GET_CATEGORIES, payload: json.data }); //el payload seran todas las categorías que me devuelve la BD
      });
  };
}

export function getProductsCategories(id) { //Listar categorías
  return function(dispatch) {
    return instance.get("http://localhost:3001/categories/product/"+id)
      .then(json => {
        dispatch({ type: GET_PRODUCT_CATEGORIES, payload: json.data }); //el payload seran todas las categorías que me devuelve la BD
      });
  };
}

export function getProductDetail(id) { //ver detalle de un producto
  return function(dispatch) {
    return instance.get("http://localhost:3001/products/" + id)
      .then(json => {
        dispatch({ type: GET_PRODUCT_DETAIL, payload: json.data }); //en este caso el payload deberia ser sólo un producto
      });
  };
}

export function cleanProductDetail() { // borra detalle de un producto del store
  return { type: CLEAN_PRODUCT_DETAIL ,
           payload:{} };
}


export function addUser(email, password){
  return {type: ADD_USER, payload: {email:email,
                                    password:password
                                    }
  }
}

export function saveNewUser(data){
  return function(dispatch){
    return instance.post("http://localhost:3001/users",data)
      .then(resp=>{
        dispatch({type: SAVE_NEW_USER, payload: resp.data})
    })
  }
}

export function getUserDetail(id) { //ver detalle de un usuario
  return function(dispatch) {
    return instance.get("http://localhost:3001/users/id/" + id)
      .then(json => {
        dispatch({ type: GET_USER_DETAIL, payload: json.data });
      });
  };
}


export function setUserState(data){
  return{type: SET_USER_STATE, payload:data}
}

export function setRedirect(state){
  return{type: SET_REDIRECT, payload:state}
}

export function setRedirectOff(){
  return{type: SET_REDIRECT_OFF}
}

export const increment = (id, prodId) => (
  function(dispatch){
    if (id === 0){
      dispatch({ type: INCREMENT, payload:prodId});
    } else {
    instance.put("http://localhost:3001/users/" + id +"/cart/" + prodId, {accion: "INC"})
    .then(json => {
        dispatch({ type: INCREMENT, payload:prodId});
      });
    }
});

export const decrement = (id, prodId) => (
  function(dispatch){
    if (id === 0){
      dispatch({ type: DECREMENT, payload:prodId});
    } else {
    instance.put("http://localhost:3001/users/" + id +"/cart/" + prodId, {accion: "DEC"})
        .then(json => {
        dispatch({ type: "DECREMENT", payload:prodId});
      });
    }
});

export function getOrders(condition) { //lista todas las órdenes que no son carrito, de todos los usuarios
  return function(dispatch) {
    return instance.get("http://localhost:3001/orders/"+condition)
      .then(json => {
        dispatch({ type: GET_ORDERS, payload: json.data }); //el payload seran todos las órdenes
      });
  };
}

export function getProductsFromOrder(id) { //lista todos los productos de una orden
  return function(dispatch) {
    return instance.get("http://localhost:3001/orders/"+ id +"/products/")
      .then(json => {
        dispatch({ type: GET_PRODUCTS_FROM_ORDER, payload: json.data }); //el payload seran todos los productos de la orden
      });
  };
}

export function setPassword(id,pwd) { //Cambia la password del usuario en caso de que se pida un reseteo
  return function(dispatch) {
    return instance.get("http://localhost:3001/users/id/"+id)   //Busca al Usuario con el id pedido
      .then(user => {
        let data = {...user.data, password:pwd}
        return instance.put("http://localhost:3001/users/"+data.id,data) //Guarda la nueva contraseña en el usuario correspondiente
        .then(answer => {
          return instance.put("http://localhost:3001/admin/"+data.id,data)  // ya no se le pide al usuario que cambio de contraseña
          .then(answer => {
            dispatch({ type: SET_PASSWORD});
          })

        });
      })
  }
}

export function setPasswordReset(id){
  return function(dispatch) {
    console.log(id)
    return instance.put("http://localhost:3001/admin/"+ id ) //Se le pida al usuario "id" que cambie su contraseña, (tambien si se vuelve a ejecutar, el pedido es negado)
      .then(json => {
        dispatch({ type: RESET_PASSWORD, payload:json});
      });
  };
}

  export function userLogout(){
    return ({type: USER_LOGOUT})
  }

  export function setRating (rating){
    return {type: SET_RATING, payload:rating}
  }

  export function getReview (id){
    return function(dispatch) {
      return axios.get("http://localhost:3001/products/"+ id +"/review") //Se le pida al usuario "id" que cambie su contraseña, (tambien si se vuelve a ejecutar, el pedido es negado)
        .then(json => {
          dispatch({ type: GET_REVIEWS, payload:json});
        });
    };
  }

  //ADMIN PARA SETEAR ESTADOS DE LAS ORDENES!
  export function completeOrder(id,estado){
    return function (dispatch){
      return instance.put('http://localhost:3001/orders/'+id+"/"+estado)
      .then(resp =>{
        dispatch({type: COMPLETE_ORDER, payload:resp.data}) 
      })
      .catch(err=>{
        alert(err);
      })
    }
  }

  export function completeOrderUser(id){
    return function (dispatch){
      return instance.put('http://localhost:3001/orders/'+id)
      .then(resp =>{
        dispatch({type: COMPLETE_ORDER, payload:resp.data}) 
      })
      .catch(err=>{
        alert(err);
      })
    }
  }
  
  export function newOrderID (orderID){
    return {type: NEW_ORDER_ID, payload:orderID}
  }
