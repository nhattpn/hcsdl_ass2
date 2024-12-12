'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
// const bodyParser = require('body-parser');
const Routes = require('./routes');
const app = express();

const corsOptions = {
  origin: true,
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
// app.use(bodyParser.json());

app.use('/api', Routes);

app.listen(config.port, async () => {
  console.log('your app listening on url http://localhost:' + config.port )
});