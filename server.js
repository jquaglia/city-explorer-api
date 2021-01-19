'use strict';

// ===packages===

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;













// ====== Start the server ======
app.listen(PORT, () => {console.log('server is listening')});