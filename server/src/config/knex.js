require('dotenv').config({ path: '../../.env' });

if (!process.env.DATABASE_HOST) {
  console.error('Error: .env file not loaded or DATABASE_HOST not set');
  process.exit(1);
} else {
  console.log("Database Host:", process.env.DATABASE_HOST);
}

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  migrations: {
    directory: '../db/migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
});

module.exports = knex;  // Export the knex instance
