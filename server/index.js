const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const fetch       = require('node-fetch');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

let times = 0;
app.get('/api', (req, res) => {

  console.log(`hit api ${++times} times`);
  const key = process.env.VUE_APP_NOMICS_KEY;

  fetch(`https://api.nomics.com/v1/currencies/ticker?key=${key}&interval=1d,7d,30d`)
    .then(res => res.json())
    .then(data => {
      res.send(data)
    })
    .catch(err => console.warn(err));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server listening on ${port}`));
