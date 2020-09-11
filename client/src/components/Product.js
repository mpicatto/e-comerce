import React from 'react';
import style from './product.module.css';
import {Link} from "react-router-dom";


export default function Product(props){


    return (
            <div class="card col-3">
              <img className= {`card-img-top ${style.foto}`} src={"http://localhost:3001/"+props.image} />
                <div class="card-body">
                  <h5 class={`card-title ${style.title}`}>{props.name}</h5>
                  <p class={`card-title ${style.title}`}>Precio $ {props.price}</p>
                  <Link to={`/products/${props.id}`}>
                  <span class={`btn btn-outline-success btn-sm ${style.botonDetalle1}`}>Detalle</span>
                  </Link>
                </div>
            </div>
    )
}
