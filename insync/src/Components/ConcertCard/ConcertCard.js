import React from 'react';
import './ConcertCard.scss';

function ConcertCard({ concert }) {
  return (
    <div className="concert-card">
      <img className='concert-card__img' src={concert.image} alt={concert.name} />  
      <h2>{concert.name}</h2>
      <p>City: {concert.city}</p>
      <p>
        <a className='concert-card__btn' href={concert.url} target="_blank" rel="noopener noreferrer">
          More Info
        </a>
      </p>
    </div>
  );
}

export default ConcertCard;