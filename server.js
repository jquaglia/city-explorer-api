'use strict';

// ========= packages =========
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

// ========= setup the application =========
const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
app.use(cors());

// ========= Other Global Variables =========
const PORT = process.env.PORT || 3111;

// ========= Routes =========
app.get('/', homeBase);
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/parks', getParks);
app.get('/movies', getMovies);
app.get('/yelp', getYelp);

// ========= Route Callbacks =========
function homeBase(request, response) {
  response.send('You made it home, party time!')
};

function getLocation(request, response) {
  const searchedCity = request.query.city;
  const key = process.env.GEOCODE_API_KEY;
  const sqlQuery = 'SELECT * FROM location WHERE search_query=$1';
  const sqlArray = [searchedCity];

  client.query(sqlQuery, sqlArray)
    .then(result => {
      // console.log(result.rows);
      if (result.rows.length === 0) {
        if (request.query.city === '') {
          response.status(500).send('Error pick a city to explore')
          return;
        };
        const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${searchedCity}&format=json`;
        superagent.get(url)
        .then(result => {
          const locationObject = result.body[0];
          const newLocation = new Location(searchedCity, locationObject);
          const sqlQuery = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4)';
          const sqlArray = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];
          client.query(sqlQuery, sqlArray);
          response.send(newLocation);
        })
        .catch(error => {
          response.status(500).send('locationiq failed')
          console.log(error.message);
        });
      } else {
        response.send(result.rows[0]);
      };
    });
};

function getWeather(request, response) {
  const searchedCity = request.query.search_query;
  const key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=8&city=${searchedCity}&country=US&key=${key}`;

  superagent.get(url)
    .then(result => {
      const weatherArray = result.body.data.map(weatherObject => new Weather(weatherObject));
      response.send(weatherArray)
    })
    .catch(error => {
      response.status(500).send('weather retrieval failed')
      console.log(error.message);
    });
};

function getParks(request, response) {
  const searchedCity = request.query.formatted_query;
  const key = process.env.PARKS_API_KEY;
  const url = `https://developer.nps.gov/api/v1/parks?limit=10&q=${searchedCity}&api_key=${key}`;

  superagent.get(url)
    .then(result => {
      const parkArray = result.body.data.map(parkObject => new Park(parkObject));
      response.send(parkArray)
    })
    .catch(error => {
      response.status(500).send('parks not found')
      console.log(error.message);
    });
};

function getMovies(request, response) {
  const searchedCity = request.query.search_query;
  const key = process.env.MOVIE_API_KEY
  const url = `https://api.themoviedb.org/3/search/movie?total_results=20&api_key=${key}&language=en-US&query=${searchedCity}`;

  superagent.get(url)
    .then(result => {
      const moveieArray = result.body.results.map(movieObject => new Movie(movieObject));
      response.send(moveieArray)
    })
    .catch(error => {
      response.status(500).send('movies not found')
      console.log(error.message);
    });
};

function getYelp(request, response) {
  const searchedCity = request.query.search_query;
  const key = process.env.YELP_API_KEY;
  const url = `https://api.yelp.com/v3/businesses/search?location=${searchedCity}&limit=20`;
  
  superagent.get(url)
  .set('Authorization', `Bearer ${key}`)
  .then(result => {
      console.log('BODY', result.body.businesses);
      const yelpArray = result.body.businesses.map(yelpObject => new Yelp(yelpObject));
      response.send(yelpArray)
      console.log('BODY', result.body.businesses)
    })
    .catch(error => {
      response.status(500).send('restaurants not found')
      console.log(error);
    });
};

// ========= Helper Funtions =========
function Location(city, object) {
  this.search_query = city;
  this.formatted_query = object.display_name;
  this.longitude = object.lon;
  this.latitude = object.lat;
}

function Weather(object) {
  this.forecast = object.weather.description;
  this.time = object.valid_date;
}

function Park(object) {
  this.name = object.fullName;
  this.address = `${object.addresses[0].line1} ${object.addresses[0].city}, ${object.addresses[0].stateCode} ${object.addresses[0].postalCode}`;
  this.fee = object.entranceFees[0].cost;
  this.description = object.description;
  this.url = object.url;
}

function Movie(object) {
  this.title = object.original_title;
  this.overview = object.overview;
  this.average_votes = object.vote_average;
  this.total_votes = object.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${object.poster_path}`;
  this.popularity = object.popularity;
  this.released_on = object.release_date;
}

function Yelp(object){
  this.name = object.name;
  this.image_url = object.image_url;
  this.price = object.price;
  this.rating = object.rating;
  this.url = object.url;
}

// ========= Start the server =========
client.connect()
  .then(() => {
    app.listen(PORT, () => { console.log(`server is listening on Port ${PORT}`) });
  })
  .catch(error => console.error(error.message));
