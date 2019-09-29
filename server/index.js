const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const fetch       = require('node-fetch');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

let nomicsTimes = 0;
let cryptoCompareTimes = 0;
let coinApiTimes = 0;

app.get('/api/coins', (req, res) => {

  console.log(`hit nomics ${++nomicsTimes} times`);
  const NOMICS_KEY = process.env.VUE_APP_NOMICS_KEY;
  
  fetch(`https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_KEY}&interval=1d,7d,30d`)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => console.warn(err));

});

app.get('/api/news', (req, res) => {

  console.log(`hit crypto compare ${++cryptoCompareTimes} times`);
  const CRYPTO_COMPARE_KEY = process.env.VUE_APP_CRYPTO_COMPARE_KEY;

  fetch(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${CRYPTO_COMPARE_KEY}`)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => console.warn(err));

});

app.get('/api/getCandle/:symbol', (req, res) => {

  const COIN_API_IO_KEY = process.env.VUE_APP_COIN_API_KEY;
  console.log(`hit coin api ${++coinApiTimes} times`);

  fetch(`https://rest.coinapi.io/v1/ohlcv/BTC/USD/latest?period_id=1day`, {
    method: 'GET',
    headers: {
      'X-CoinAPI-Key': COIN_API_IO_KEY
    }
  })
    .then(res => res.json())
    .then(data => {
      let filteredData = data.filter((item, index) => index < 10);
      res.send(filteredData);
    })
    .catch(err => console.warn(err));
    
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server listening on ${port}`));
