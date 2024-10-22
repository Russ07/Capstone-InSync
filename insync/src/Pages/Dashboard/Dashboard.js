import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.scss';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../Components/Card/Card';
import GenreCard from '../../Components/GenreCard/GenreCard';
import SpotifyPlayer from '../../Components/SpotifyPlayer/SpotifyPlayer';


function Dashboard() {
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie.includes('connect.sid')) {
      navigate('/'); // Redirect to Authorization page
      return;
    }

    // Fetch top artists
    axios.get('http://localhost:3000/top-artists', { withCredentials: true })
      .then(response => {
        console.log('Top Artists Data:', response.data); // Log data to console
        setArtists(response.data);

        const genreMapping = {
          Rock: ['rock', 'alternative rock', 'indie rock', 'hard rock', 'classic rock', 'punk rock', 'progressive rock'],
          HipHop: ['hip hop', 'rap', 'trap', 'gangsta rap', 'boom bap', 'conscious hip hop'],
          Pop: ['pop', 'dance pop', 'electropop', 'teen pop', 'k-pop'],
          Electronic: ['electronic', 'edm', 'house', 'techno', 'trance', 'dubstep', 'drum and bass'],
          Jazz: ['jazz', 'smooth jazz', 'bebop', 'cool jazz', 'free jazz'],
          RnB: ['r&b', 'neo soul', 'contemporary r&b'],
          Country: ['country', 'alt-country', 'country pop', 'classic country'],
          Classical: ['classical', 'baroque', 'romantic', 'modern classical', 'opera'],
          Reggae: ['reggae', 'dub', 'dancehall', 'roots reggae'],
          Blues: ['blues', 'electric blues', 'delta blues', 'chicago blues'],
          Metal: ['metal', 'heavy metal', 'thrash metal', 'death metal', 'black metal'],
          Folk: ['folk', 'indie folk', 'folk rock', 'traditional folk'],
          Latin: ['latin', 'reggaeton', 'latin pop', 'salsa', 'bachata'],
        };

        const allGenres = response.data.map(artist => artist.genres).flat();
        const sortedGenres = Object.keys(genreMapping).filter(key =>
          allGenres.some(genre => genreMapping[key].includes(genre))
        );
        setGenres(sortedGenres);
      })
      .catch(error => {
        console.error('Error fetching top artists:', error);
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
      });

    // Fetch top tracks
    axios.get('http://localhost:3000/top-tracks', { withCredentials: true })
      .then(response => {
        console.log('Top Tracks Data:', response.data); // Log data to console
        setTracks(response.data);
      })
      .catch(error => {
        console.error('Error fetching top tracks:', error);
        if (error.response && error.response.status === 401) {
          navigate('/'); // Redirect to Authorization page on 401
        }
      });
  }, [navigate]);

  return (
    <div className="dashboard">
      <h1 className="dashboard__heading">The Artist Who Dominated Your Playlist</h1>
      <section className='cards-section'>
        <div className="artist-cards">
          {artists.map(artist => (
            <Card key={artist.id} image={artist.images[0]?.url} text={artist.name} url={artist.external_urls} />
          ))}
        </div>
        <div className="genre-cards">
          {genres.map((genre, index) => (
            <GenreCard key={index} image={`path/to/genre-images/${genre.toLowerCase()}.jpg`} text={genre} />
          ))}
        </div>
        <h2 className="dashboard__heading">The Genres That Define Your Soundtrack</h2>
        <Link to="/recommended-playlists" className="dashboard__link">Discover More Playlists</Link>
        <h3>Most Listened Songs</h3>
        <ul>
          {tracks.map(track => (
            <li key={track.id}>
              <SpotifyPlayer trackId={track.id} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;



