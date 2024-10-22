require('dotenv').config();
const express = require('express');
const { passport, spotifyApi } = require('./src/config/passport');
const session = require('express-session');
const knex = require('./src/config/knex');
const axios = require('axios');
const cors = require('cors');
require('./src/config/passport');

const app = express();
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { secure: false, httpOnly: false } }));
app.use(passport.initialize());
app.use(passport.session());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); 

app.get('/auth/spotify', passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'user-top-read', 'user-library-read', 'playlist-modify-public']
}));

app.get('/auth/spotify/callback', 
  passport.authenticate('spotify', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('http://localhost:3001/dashboard');
  }
);

app.get('/top-artists', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User not authenticated');
  }
  const session = await knex('sessions').where({ spotify_id: req.user.id }).first();
  spotifyApi.setAccessToken(session.access_token);
  try {
    const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 9 });
    const artists = topArtistsData.body.items.map(artist => ({
      external_urls: artist.external_urls.spotify,
      genres: artist.genres,
      images: artist.images,
      name: artist.name,
      id: artist.id
    }));
    res.json(artists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).send('Error fetching top artists');
  }
});

app.get('/top-tracks', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  const session = await knex('sessions').where({ spotify_id: req.user.id }).first();
  spotifyApi.setAccessToken(session.access_token);

  try {
    const topTracksData = await spotifyApi.getMyTopTracks({ limit: 5 });
    const tracks = topTracksData.body.items.map(track => ({
      name: track.name,
      album: track.album.name,
      artists: track.artists.map(artist => artist.name),
      duration_ms: track.duration_ms,
      external_urls: track.external_urls.spotify,
      id: track.id
    }));
    console.log(tracks); 
    res.json(tracks); 
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).send('Error fetching top tracks');
  }
});

app.get('/liked-songs', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  const session = await knex('sessions').where({ spotify_id: req.user.id }).first();
  spotifyApi.setAccessToken(session.access_token);

  try {
    const likedTracksData = await spotifyApi.getMySavedTracks({ limit: 50 });
    const likedTracks = likedTracksData.body.items.map(item => ({
      name: item.track.name,
      album: item.track.album.name,
      artists: item.track.artists.map(artist => artist.name),
      duration_ms: item.track.duration_ms,
      external_urls: item.track.external_urls.spotify,
      id: item.track.id
    }));
    res.json(likedTracks); 
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).send('Error fetching liked songs');
  }
});

app.get('/concerts-by-artists', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  const session = await knex('sessions').where({ spotify_id: req.user.id }).first();
  spotifyApi.setAccessToken(session.access_token);

  try {
    const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 9 });
    const artists = topArtistsData.body.items;

    console.log('Ticketmaster API Key:', process.env.TICKETMASTER_API_KEY); 

    const concerts = [];
    for (let artist of artists) {
      await delay(1000); 
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events', {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY, 
          keyword: artist.name,
          countryCode: 'GB', 
          size: 5 
        }
      });
      if (response.data._embedded && response.data._embedded.events) {
        const artistConcerts = response.data._embedded.events.map(event => ({
          name: event.name,
          city: event._embedded.venues[0].city.name,
          url: event.url,
          image: event.images[0].url 
        }));
        console.log(`Concerts for ${artist.name}:`, artistConcerts); 
        concerts.push(...artistConcerts);
      }
    }

    res.json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    res.status(500).send('Error fetching concerts');
  }
});

app.get('/recommend-playlists', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  const session = await knex('sessions').where({ spotify_id: req.user.id }).first();
  spotifyApi.setAccessToken(session.access_token);

  try {
    const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 10 });
    const genres = [...new Set(topArtistsData.body.items.flatMap(artist => artist.genres))]; 

    const genrePlaylists = await Promise.all(genres.map(async genre => {
      const playlistsData = await spotifyApi.searchPlaylists(genre, { limit: 2 });
      return playlistsData.body.playlists.items.map(playlist => ({
        name: playlist.name,
        image: playlist.images[0]?.url,
        url: playlist.external_urls.spotify,
        genre: genre
      }));
    }));

    const playlistRecommendations = genrePlaylists.flat();
    console.log(playlistRecommendations); 
    res.json(playlistRecommendations); 
  } catch (error) {
    console.error('Error fetching recommended playlists:', error);
    res.status(500).send('Error fetching recommended playlists');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});



