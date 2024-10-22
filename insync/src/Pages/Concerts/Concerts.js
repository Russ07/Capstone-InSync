import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Concerts.scss';
import ConcertCard from '../../Components/ConcertCard/ConcertCard';
import LoadingOverlay from '../../Components/LoadingOverlay/LoadingOverlay';

import { Link, useNavigate } from 'react-router-dom';

function Concerts() {
    const [concerts, setConcerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get('http://localhost:3000/concerts-by-artists', { withCredentials: true })
        .then(response => {
          console.log('Concert Data:', response.data); // Log data to console
          setConcerts(response.data);
          setIsLoading(false); // Hide the loading overlay
        })
        .catch(error => {
          console.error('Error fetching concert data:', error);
          setIsLoading(false); // Hide the loading overlay even if there's an error
        });
    }, []);
  
    return (
      <div className="concerts">
        {isLoading && <LoadingOverlay />}
        <h1 className="concerts__heading">Upcoming Concerts</h1>
        <h3 className="concerts__heading">You might be interested in this event based on your taste</h3>
        <div className="concert-list">
          {concerts.map((concert, index) => (
            <ConcertCard key={index} concert={concert} />
          ))}
        </div>
      </div>
    );
  }
  
  export default Concerts;