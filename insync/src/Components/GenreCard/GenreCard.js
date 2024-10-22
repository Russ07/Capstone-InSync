import React from 'react';
import { Link } from 'react-router-dom';
import './GenreCard.scss';

function GenreCard({ image, text, url }) {
  return (
    <Link to={url} className="genre-card">
      <h2 className="genre-card__heading">{text}</h2>
    </Link>
  );
}

export default GenreCard;
