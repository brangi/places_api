const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const ctrl = require('./api_controller');

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/places', async(req, res) => {
  const {lat, lng, name} = req.query;
  const result = await ctrl.findNearBy(Number(lat),  Number(lng), name);
  res.send(result);
});

app.listen(3000, () => {
  console.log('Starting in port 3000');
});