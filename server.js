'use strict';

// ====== packages ======

const express = require('express');

const cors = require('cors');

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
  if (request.query.city === ''){
    response.status(500).send('Error pick a city to explore')
    return;
  }

  // ====== Normalize Data ======
  const theDataArrayFromTheLocationJson = require('./data/location.json');
  const theDataObjFromJson = theDataArrayFromTheLocationJson[0];
  
  // ====== Data from the client ======
  console.log('request.query', request.query)
  console.log('request.query.city', request.query.city)
  const searchedCity = request.query.city;

  const newLocation = new Location(
    searchedCity,
    theDataObjFromJson.display_name,
    theDataObjFromJson.lat,
    theDataObjFromJson.lon
  );
    console.log('newLocation', newLocation);
  response.send(newLocation);
});




// ====== Helper Funtions ======
function Location(search_query, formatted_query, latitude, longitude){
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.longitude = longitude;
  this.latitude = latitude;
}


// ====== Start the server ======
app.listen(PORT, () => {console.log(`server is listening on Port ${PORT}`)});