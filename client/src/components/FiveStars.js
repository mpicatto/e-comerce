import React,{useState} from 'react';
import {FaStar} from 'react-icons/fa';
import { connect } from 'react-redux';
import { setRating } from '../actions/index';

export const StarRating = (props) =>{
    const [rating, setRating] = useState(props.rating)


    return <div>
    {[...Array(5)].map((star, i)=>{
        const ratingValue = i+1
        return (
            <label>
            <input type="radio"
            name="rating"
            style={{display:"none", width:"10px", height:"10px"}}
            value={ratingValue}

              />
            <FaStar size= {15}
             color={ratingValue <=(rating) ? "#ffc107":"#e4e5e9" }

             style={{cursor:"pointer",
                    transition:"color 200ms"}} />
            </label>
        )
    })}

    </div>
}

const mapStateToProps = state => {
    return {
      

    }
  }

  const mapDispatchToProps = dispatch => {
    return {

    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(StarRating);
