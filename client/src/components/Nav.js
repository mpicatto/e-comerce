import React, { Component } from "react";
import SearchBar from './SearchBar.js';
import { Link, Route} from 'react-router-dom';
import { connect } from "react-redux";
import stilo from './Nav.module.css';
import { userLogout, setRedirectOff } from '../actions/index';
import axios from 'axios';
//import './global.css';

//arreglo menores, se cambiaron los class por className y los fill-rule por fillRule de las tags, debido a los errores de la consola

//COMPONENTE NAVBAR
export class Nav extends Component {
  constructor(props){
    super(props)
  }

  //FUNCION PARA CERRAR SESION
  logout (e){
    e.preventDefault(e)
    this.props.setRedirectOff()

    //CON ESTA FUNCION SOLO CAMBIAMOS EL ESTADO DE USERID A 0, ISADMIN A FALSE Y PWRESET A FALSE
    this.props.userLogout()

    //CON ESTA LLAMADA LE PEGAMOS A LOGOUT EN EL BACK Y SE ROMPE LA COOKIE.. NO OLVIDAR MANDAR LAS CREDENCIALES
    // axios.get('http://localhost:3001/logout',{withCredentials:true})
    axios.get('http://localhost:3001/logout')
    .then(res=>{
      alert("Sesión cerrada");
    })

    //MANEJO DE ERRORES...
    .catch(err=>{
      alert(err);
    })
    return;
  }

  render(){
    return (

      <nav id={stilo.navigation} className = {`${stilo.fixed} ${stilo.top} right ${stilo.navigation} ${stilo.shadowsIntoLight} ${stilo.navBar}`}>
        <div>
          <Link to='/' onClick={()=>this.props.onSearch("")}>
            <span id={`${stilo.navigation}${stilo.nombreEmpresa}`}>
              Universo Verde <img className= {stilo.icono} src="http://localhost:3001/food.ico" />
            </span>
          </Link>
        </div>
        <div>
          {/* MUESTRA EL CATALOGO COMPLETO */}
          <Link to='/products'onClick={()=>this.props.onSearch("")}>
            <span id={stilo.navigation}> Tienda <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-shop" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M0 15.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM3.12 1.175A.5.5 0 0 1 3.5 1h9a.5.5 0 0 1 .38.175l2.759 3.219A1.5 1.5 0 0 1 16 5.37v.13h-1v-.13a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.13H0v-.13a1.5 1.5 0 0 1 .361-.976l2.76-3.22z"/>
                <path d="M2.375 6.875c.76 0 1.375-.616 1.375-1.375h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 1 0 2.75 0h1a2.375 2.375 0 0 1-4.25 1.458 2.371 2.371 0 0 1-1.875.917A2.37 2.37 0 0 1 8 6.958a2.37 2.37 0 0 1-1.875.917 2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.5h1c0 .76.616 1.375 1.375 1.375z"/>
                <path d="M4.75 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                <path fillRule="evenodd" d="M2 7.846V7H1v.437c.291.207.632.35 1 .409zm-1 .737c.311.14.647.232 1 .271V15H1V8.583zm13 .271a3.354 3.354 0 0 0 1-.27V15h-1V8.854zm1-1.417c-.291.207-.632.35-1 .409V7h1v.437zM3 9.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V15H7v-5H4v5H3V9.5zm6 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4zm1 .5v3h2v-3h-2z"/>
              </svg>
            </span>
          </Link>

          {/* LISTADO DE CATEGORIAS */}
          <Link to = "/categories" onClick={()=>this.props.onSearch("")}>
            <span id={stilo.navigation}>Categorias</span>
          </Link>

          {/* RENDERIZADO CONDICIONAL SI ES ADMIN MUESTRA LAS OPCIONES DE ADMINISTRADOR(AGREGAR PRODUCTO, CATEGORIA, MANEJO DE USERS) */}
          {this.props.user.isAdmin ? <Link to = "/admin">
            <span id={stilo.navigation}> Opciones </span>
          </Link>: null}

          {/* SI NO HAY USER LOGUEADO MUESTRA LOGIN */}
          {!this.props.user.id && <Link to = "/login"><span className={`${stilo.navigation} ${stilo.shadowsIntoLight} ${stilo.textSize} `}>Login </span></Link> }

          {/* SI ESTA LOGUEADO MUESTRA LOGOUT */}
          {this.props.user.id && this.props.user.id?<Link to = "/"><span className={`${stilo.navigation} ${stilo.shadowsIntoLight} ${stilo.textSize} `} onClick={(e)=>this.logout(e)}> Logout </span></Link>: null}

          {/* SI ESTA LOGUEADO MUESTRA "PERFIL" */}
          {this.props.user.id && this.props.user.id?<Link to = "/me"><span className={`${stilo.navigation} ${stilo.shadowsIntoLight} ${stilo.textSize} `}> Perfil </span></Link>: null}

          {/* LINK PARA IR AL CARRITO DE COMPRAS DE UN USUARIO LOGUEADO */}
          <Link to = {"/cart/" + this.props.user.id} onClick={()=>this.props.onSearch("")}>
            <span id={stilo.navigation}><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cart-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            </span>
          </Link>
        </div>

          {/* LA NAV BAR SIEMPRE ESTA RENDERIZADA */}
          <Route exact path='/products' render={() => <SearchBar onSearch={this.props.onSearch}/>}/>


      </nav>

    )
  }
}

  function mapStateToProps(state) {
    return {
      user: state.user
    };
  }

  const mapDispatchToProps = dispatch => {
    return {
      userLogout:() => dispatch(userLogout()),
      setRedirectOff:() =>dispatch(setRedirectOff())
    }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(Nav);
