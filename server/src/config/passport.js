require('dotenv').config({ path: '../../.env' });
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const knex = require('./knex'); 
const SpotifyWebApi = require('spotify-web-api-node');

passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI,
    scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'user-top-read', 'user-library-read', 'playlist-modify-public'],
  },
  async (accessToken, refreshToken, expires_in, profile, done) => {
    console.log('Access Token:', accessToken);
  
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    const session = await knex('sessions').where({ spotify_id: profile.id }).first();
  
    if (session) {
      await knex('sessions').where({ spotify_id: profile.id }).update({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      });
    } else {
      await knex('sessions').insert({
        spotify_id: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      });
    }
  
    spotifyApi.setAccessToken(accessToken);
  
    try {
      const tokenInfo = await spotifyApi.getMe();
      console.log('Access Token Scopes:', tokenInfo.body.scope);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
    done(null, profile);
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    const session = await knex('sessions').where({ spotify_id: user.id }).first();
    done(null, { id: session.spotify_id, displayName: user.displayName });
  });

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
  module.exports = { passport, spotifyApi };
  