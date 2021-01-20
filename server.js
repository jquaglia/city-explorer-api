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

  // ====== Normalize Data ======
  // const theDataArrayFromTheLocationJson = require('./data/location.json');

  // ====== Data from the client ======
  const searchedCity = request.query.city;
  const key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${searchedCity}&format=json`;

  superagent.get(url)
    .then(result => {
      // console.log('BODY', result.body);
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
  const weatherData = require('./data/weather.json');
  const weatherArray = weatherData.data.map(object => {
    const newWeather = new Weather(
      object.weather.description,
      object.valid_date
    );
    return newWeather;
  });

  response.send(weatherArray)
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


// ====== Start the server ======
app.listen(PORT, () => { console.log(`server is listening on Port ${PORT}`) });