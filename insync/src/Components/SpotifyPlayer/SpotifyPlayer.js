import React from 'react';
import './SpotifyPlayer.scss';

function SpotifyPlayer({ trackId }) {
  return (
    <div className="spotify-player">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width="500"
        height="100"
        frameBorder="0"
        allow="encrypted-media"
        title="Spotify Player"
      ></iframe>
    </div>
  );
}

export default SpotifyPlayer;
