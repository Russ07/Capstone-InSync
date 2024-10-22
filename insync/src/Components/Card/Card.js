import React from 'react';
import { Link } from 'react-router-dom';
import './Card.scss';

function Card({ image, text, url }) {
  return (
    <Link to={url} className="card">
      <img src={image} alt={text} className="card__image" />
      <h2 className="card__heading">{text}</h2>
    </Link>
  );
}

export default Card;
