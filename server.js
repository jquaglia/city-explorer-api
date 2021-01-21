'use strict';

// ========= packages =========
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

// ========= setup the application =========
const app = express();
app.use(cors());

// ========= Other Global Variables =========
const PORT = process.env.PORT || 3111;

// ========= Routes =========
app.get('/', homeBase);
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/parks', getParks);

// ========= Route Callbacks =========
function homeBase(request, response) {
  response.send('You made it home, part time!')
};

function getLocation(request, response) {
  if (request.query.city === '') {
    response.status(500).send('Error pick a city to explore')
    return;
  };

  const searchedCity = request.query.city;
  const key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${searchedCity}&format=json`;

  superagent.get(url)
  .then(result => {
    const locationObject = result.body[0];
    const newLocation = new Location(searchedCity, locationObject);
    response.send(newLocation);
  })
  .catch(error => {
    response.status(500).send('locationiq failed')
    console.log(error.message);
  });
};

function getWeather(request, response){
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

function getParks(request, response){
  const searchedCity = request.query.search_query;
  const key = process.env.PARKS_API_KEY
  const url = `https://developer.nps.gov/api/v1/parks?limit=10&q=${searchedCity}&api_key=${key}`

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

// ========= Helper Funtions =========
function Location (city, object){
  this.search_query = city;
  this.formatted_query = object.display_name;
  this.longitude = object.lon;
  this.latitude = object.lat;
}

function Weather(object){
  this.forecast = object.weather.description;
  this.time = object.valid_date;
}

function Park(object){
  this.name = object.fullName;
  this.address = `${object.addresses[0].line1} ${object.addresses[0].city}, ${object.addresses[0].stateCode} ${object.addresses[0].postalCode}`;
  this.fee = object.entranceFees.cost;
  this.description = object.description;
  this.url = object.url;
}

// ========= Start the server =========
app.listen(PORT, () => { console.log(`server is listening on Port ${PORT}`) });