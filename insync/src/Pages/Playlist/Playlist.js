import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Playlist.scss';
import ConcertCard from '../../Components/ConcertCard/ConcertCard';
import LoadingOverlay from '../../Components/LoadingOverlay/LoadingOverlay';

;

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/recommend-playlists', { withCredentials: true })
      .then(response => {
        console.log('Playlist Data:', response.data); // Log data to console
        
        const uniqueNames = new Set();
        const filteredPlaylists = response.data.filter(playlist => {
          const truncatedName = playlist.name.split(' ').slice(0, 4).join(' ');
          if (uniqueNames.has(truncatedName)) {
            return false;
          } else {
            uniqueNames.add(truncatedName);
            return true;
          }
        });

        const truncatedPlaylists = filteredPlaylists.map(playlist => {
          const truncatedName = playlist.name.split(' ').slice(0, 4).join(' ');
          return { ...playlist, name: truncatedName };
        });
        setPlaylists(truncatedPlaylists);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching playlist data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="playlist">
      {isLoading && <LoadingOverlay />}
      <h2 className="playlist__heading">Recommended Playlists</h2>
      <div className="playlist-cards">
        {playlists.map((playlist, index) => (
          <ConcertCard
            key={index}
            concert={{
              name: playlist.name,
              city: playlist.genre, // We'll use genre in place of city
              url: playlist.url,
              image: playlist.image
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Playlist;
