import React from 'react';
import {Link} from "react-router-dom";
import style from './categoryCard.module.css';

//se importo Link de react-router-dom
export default function CategoryCard (props) {

// se agrego el link to correctament, mirar app para la ruta
    return (
      <div class="card col-3">
        <img class={`card-img-top ${style.fotoDetalle2}`} src="https://fruittoday.com/wp-content/uploads/2015/07/Noticia-1.jpg" />
          <Link to={`/category/${props.id}`}>
            <h3 class={`card-title  ${style.shadowsIntoLight}`} >{props.name}</h3>
          </Link>
            <p class="card-text text">{props.description}</p>
      </div>
    )

}
