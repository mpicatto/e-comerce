import { ADD_PRODUCT_TO_CART, ADD_CATEGORY, REMOVE_PRODUCT_FROM_CART, REMOVE_CATEGORY, SET_PRODUCT, SET_CATEGORY,
  GET_PRODUCTS,GET_PRODUCTS_BY_NAME, GET_PRODUCTS_FROM_CATEGORY, GET_CATEGORIES,GET_PRODUCT_CATEGORIES,
  GET_CAT_FROM_PRODUCT, GET_PRODUCT_DETAIL,CLEAN_PRODUCT_DETAIL, GET_PRODUCTS_CART, ADD_USER, SAVE_NEW_USER,GET_USER_DETAIL,
  SET_REDIRECT,SET_REDIRECT_OFF, SET_ADMIN,SET_USER_STATE, USER_LOGOUT, SET_RATING, COMPLETE_ORDER,
  GET_ORDERS, GET_PRODUCTS_FROM_ORDER, SET_PASSWORD,RESET_PASSWORD, GET_REVIEWS } from '../actions';


//Definimos el estado inicial
const initialState = {
  products: [],
  user: {
    id: 0,
    pwdReset: false,
    isAdmin: false
  },
  order: {products:[]}, //tenemos una lista de productos
  categories: [],
  productCategories:[],
  productDetail: {categoryId: []},
  newUser:{},
  userDetails:{},
  admin:false,
  redirect:null,
  rating: 0,
  ordenes: [],
  productsFromOrder: {},
  review: []
};

//state.order.concat[action.payload]
//state.order.concat([action.payload])
function rootReducer(state = initialState, action) {

  if (action.type === ADD_PRODUCT_TO_CART) { //Agregamos un producto al carrito
 
    if (state.user.id==0) { //SI EL USUARIO ES GUEST...
      var aux = state.order.products.concat([action.payload]) //SE GUARDA EL ESTADO ACTUAL DE LA ORDEN Y SE AGREGA EL ULTIMO PRODUCTO
      var noDuplicados = aux.filter((el, i, self) =>
      i === self.findIndex((t) => (t.productId == el.productId))
      )
      var res = noDuplicados.map(el => {
        if (!el.cantidad){
          var cantidad = 0
        }else {cantidad = el.cantidad-1}    //Por algun motivo, aumenta la cantidad en 2 del producto comprado y en 1 a los demas, restandole 1 se resuelve
        aux.map(item => {
          if (el.productId == item.productId){
            cantidad++
          }
        })
        console.log(cantidad)
        return {...el,cantidad}
      })
      
      return {
        ...state, //traigo todo el estado, tal cual
        order: {...state.order, products: res} 
      }
    } else {
      return{
        ...state,
        order: action.payload
      }
    }
     
  }

  if (action.type === REMOVE_PRODUCT_FROM_CART) {
    if (state.user.id==0) //quitamos un producto del carrito de compras
    return {
        ...state,
        order:{
        ...state.order,
          products: state.order.products.filter(item => item.productId != action.payload)}
          // Elimina el producto desde el carrito como guest
    }; else { 
      return {
        ...state,
        order:{
        ...state.order,
          products: state.order.products.filter(item => item.id !== action.payload)}
        }; //dejamos en el array todos los que son distintos de la que quiero eliminar
    }
  }


  if (action.type === GET_PRODUCTS) { //traemos todos los productos para listarlos
      return {
        ...state,
        products: action.payload
      };
  }


  if (action.type === GET_PRODUCTS_BY_NAME) { //traemos los productos por nombtr
    return {
      ...state,
      products: action.payload
    };
}

  if (action.type === GET_PRODUCTS_FROM_CATEGORY) { //traemos todos los productos de una categoría
      return {
        ...state,
        products: action.payload
      };
  }

  if (action.type === GET_PRODUCT_CATEGORIES) { //traemos todas las categorías para listarlas
    return {
      ...state,
      productCategories: action.payload
    };
}

  if (action.type === GET_PRODUCTS_CART) { //traemos todos los productos de una orden
    //console.log(action.payload);
      return {
        ...state,
        order: action.payload
      };
  }

  if (action.type === GET_CATEGORIES) { //traemos todas las categorías para listarlas
      return {
        ...state,
        categories: action.payload
      };
  }

  if (action.type === GET_PRODUCT_DETAIL) {
    //console.log(action.payload);
      return {
        ...state,
        productDetail: action.payload //no nos interesa guardar datos anteriores en este caso. ...state creo que puede no estar
      };
  }

  if (action.type === CLEAN_PRODUCT_DETAIL) {
    //console.log(action.payload);
      return {
        ...state,
        productDetail: action.payload //no nos interesa guardar datos anteriores en este caso. ...state creo que puede no estar
      };
  }

  if (action.type === ADD_USER){
    return {
      ...state,
      newUser: action.payload

    }
  }

  if (action.type === SAVE_NEW_USER){
    return{
      ...state,
      newUser: action.payload
    }
  }

  if (action.type === GET_USER_DETAIL){
    return{
      ...state,
      userDetails: action.payload
    }
  }

  if (action.type === SET_REDIRECT){
    return{
      ...state,
      redirect: action.payload
         }
  }

  if (action.type === SET_REDIRECT_OFF){
    return{
      ...state,
      redirect:null
         }
  }


  if (action.type === SET_ADMIN){
    return{
      ...state,
      admin: action.payload
         }
  }


  if (action.type === GET_ORDERS){
    return{
      ...state,
      ordenes: action.payload
    }
  }

  if (action.type === GET_PRODUCTS_FROM_ORDER){
    return{
      ...state,
      productsFromOrder: action.payload
    }
  }

    switch (action.type) {
    case 'INCREMENT':
    return {
      ...state,
      order:{...state.order,
        products:state.order.products.map(product =>  {
          if (product.id == action.payload || product.productId == action.payload){
            if (state.user.id === 0){
              return {
                ...product,
                cantidad:product.cantidad+1
              }
            } else {
              return {
                ...product,
                order_line:{
                  ...product.order_line,
                  cantidad:product.order_line.cantidad+1
                }
              }
            }
          } else return product
        })
      }
    };

  case 'DECREMENT':
    return {
      ...state,
      order:{
        ...state.order,
        products:state.order.products.map(product =>  {
          if (product.id == action.payload || product.productId == action.payload){
            let canti
            if (state.user.id === 0){
              canti = product.cantidad
            } else {
              canti = product.order_line.cantidad
            }  
            if (canti > 1){
              if (state.user.id === 0 ){
                return {
                  ...product,
                  cantidad:product.cantidad-1
                }
              }else{
                return {
                  ...product,
                  order_line:{
                    ...product.order_line,
                    cantidad:canti-1
                  }
                }
              }

            }  else return product
          } else return product
        })
        }
      };
    };

  if (action.type === SET_USER_STATE){
    return{
      ...state,
      user: action.payload,
      order:{}
          }
  }

  if (action.type === USER_LOGOUT){
    return{
      ...state,
      user: {
        id:0,
        pwdReset:false,
        isAdmin: false
      },
      order: {products:[]}
    }
  }

  if (action.type === SET_RATING){
    return{
      ...state,
      rating: action.payload
    }
  }


  if (action.type === GET_REVIEWS) { //traemos todas las reviews de un producto
      return {
        ...state,
        review: action.payload.data
      };
  }

  if (action.type === COMPLETE_ORDER){
    return {
      ...state,
      order: {}
    }
  }

  if (action.type === SET_PASSWORD){
    return{...state,
      user:{...state.user,pwdReset:false}
    }
  }

  if (action.type === RESET_PASSWORD){
    return{...state}
  }
  
  return state;
}

export default rootReducer;
