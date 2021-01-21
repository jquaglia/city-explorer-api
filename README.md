# city-explorer-api

**Author**: Jason

**Version**: 1.2.1

## Overview

This is my first time creating and using a server. The app I am creating takes in a location and presents a map and weather data about the location. The app also presents national park information for nearby parks. When you view data for a location, the app now saves the location info to a database.(using sql) The next time you search for that location, the app pulls the info out of the database.

## Getting Started

1. In Terminal execute:

   - `touch server.js`

   - `npm init`

   - `npm install -S express cors dotenv superagent`

   - `touch .env`

1. Open server up in code editor. Put all necessary API keys in .env file as well as PORT info.

1. Head into the `server.js` file.

1. Load Packages

   - declare variables for all packages needed

1. Configure App

   - `const app = express();`

   - `app.use(cors());`

1. Global Variables

   - `const PORT = process.env.PORT || 3111;`

1. Routes

   - `'/location' => {}`

   - `'/weather' => [{}, {}]`

   - `'/parks' => [{}, {}]`

1. Route Callbacks

1. Helper Functions

1. Start the App

   - `app.listen(PORT, () => { console.log(`server is listening on Port ${PORT}`) });`

1. You should be able to start the server with `nodemon` command (as long as you have nodemon installed [in terminal `npm i -g nodemon`])

## Architecture

This app uses: html, css, javascript, mustache, jquery, express, cors, dotenv, superagent, and SQL.

## Time Estimate

```html
Number and name of feature: Database

Estimate of time needed to complete: 30 minutes

Start time: 4:45pm

Finish time: 5:30pm

Actual time needed to complete: 45 minutes
```

```html
Number and name of feature: Server

Estimate of time needed to complete: 1 hour

Start time: 5:30pm

Finish time: 6:45pm

Actual time needed to complete: 1 hour 15 minutes
```

```html
Number and name of feature: Deploy

Estimate of time needed to complete: 30 minutes

Start time: 7:00pm

Finish time: 7:30pm

Actual time needed to complete: 30 minutes
```

## Change Log

- 01-18-21 5:35pm v1 Initial Release

- 01-18-21 5:39pm v2 Server was deployed

- 01-18-21 5:40pm v3 Added basic functionality to take a city input and always return seattle

- 01-18-21 5:57pm v4 Added error message upon invalid input

- 01-18-21 7:54pm v5 Added location data to be returned upon request

- 01-18-21 9:26pm v6 Added weather data to be returned upon city search

- 01-18-21 9:57pm v7 Updated README

- 01-19-21 4:47pm v8 Refactored code to use .map array method

- 01-19-21 5:34pm v9 Added Location API to draw data from

- 01-19-21 7:09pm v10 Added Weather API to draw data from

- 01-19-21 8:41pm v11 Added Parks API to draw data from

- 01-19-21 9:09pm v12 Updated README

- 01-20-21 10:06am v14 Added how to get started to the README

- 01-20-21 5:06pm v16 Refactored code to be more DRY

- 01-20-21 5:37am v17 Added api key

- 01-20-21 5:37am v18 Added api key

- 01-20-21 5:37am v19 Added api key

- 01-20-21 7:48pm v20 Added in sql functionality

- 01-20-21 8:25pm v24 Full deployment with db functionality

## Credits and Collaborations

Carly Dekock

Dar-Ci Calhoun

Michael Eclevea

Jason Dormier

Sang Lee
