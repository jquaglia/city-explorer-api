'use strict';

// ===packages===

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());















// ====== Start the server ======
app.listen(3000, () => {console.log('server is listening')});