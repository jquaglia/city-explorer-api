'use strict';

// ====== packages ======
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

// ====== setup the application ======
const app = express();
app.use(cors());

// ====== Other Global Variables ======
const PORT = process.env.PORT || 3111;

// ====== Routes ======
app.get('/', (request, response) => {
  response.send('you made it home, party time');
});


app.get('/location', (request, response) => {
  if (request.query.city === '') {
    response.status(500).send('Error pick a city to explore')
    return;
  }

  const searchedCity = request.query.city;
  const key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${searchedCity}&format=json`;

  superagent.get(url)
    .then(result => {
      const theDataObjFromJson = result.body[0];
      const newLocation = new Location(
        searchedCity,
        theDataObjFromJson.display_name,
        theDataObjFromJson.lat,
        theDataObjFromJson.lon
      );

      response.send(newLocation);
    })
    .catch(error => {
      response.status(500).send('locationiq failed')
      console.log(error.message);
    });

});


app.get('/weather', (request, response) => {
  const searchedCity = request.query.search_query;
  const key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=8&city=${searchedCity}&country=US&key=${key}`;

  superagent.get(url)
    .then(result => {
      const weatherData = result.body;
      const weatherArray = weatherData.data.map(object => {
        const newWeather = new Weather(
          object.weather.description,
          object.valid_date
        );
        return newWeather;
      });

      response.send(weatherArray)
    })
    .catch(error => {
      response.status(500).send('weather retrieval failed')
      console.log(error.message);
    });

});


app.get('/parks', (request, response) => {
  const searchedCity = request.query.search_query;
  console.log('QUERY', searchedCity)
  const key = process.env.PARKS_API_KEY
  const url = `https://developer.nps.gov/api/v1/parks?limit=10&q=${searchedCity}&api_key=${key}`

  superagent.get(url)
    .then(result => {
      const parkData = result.body;
      const parkArray = parkData.data.map(object => {
        const newPark = new Park(
          object.fullName,
          `${object.addresses[0].line1} ${object.addresses[0].city}, ${object.addresses[0].stateCode} ${object.addresses[0].postalCode}`,
          object.entranceFees.cost,
          object.description,
          object.url
        );
        return newPark;
      });

      response.send(parkArray)
    })
    .catch(error => {
      response.status(500).send('parks not found')
      console.log(error.message);
    });

});


// ====== Helper Funtions ======
function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.longitude = longitude;
  this.latitude = latitude;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function Park(name, address, fee, description, url) {
  this.name = name;
  this.address = address;
  this.fee = fee;
  this.description = description;
  this.url = url;
}

// ====== Start the server ======
app.listen(PORT, () => { console.log(`server is listening on Port ${PORT}`) });