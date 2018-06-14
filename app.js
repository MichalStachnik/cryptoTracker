//TODO: Add left bar with prices
//TODO: toggle between daily and hourly
//TODO: create news feed
//TODO: implement refresh every 60 sec
//TODO: get image and finish table
//TODO: add transitions on change

let app = new Vue({
  el: "#app",
  data: {
    coins: [],
    prices: [],
    pricesNorm: [],
    max: 0,
    min: 0
  },
  created: function() {
    this.getCoins();
    this.getCoinPrices()
  },
  methods: {

    // Change chart on click
    handleClick: function(c) {
      let symbol = c.symbol;
      this.getCoinPrices(symbol);
    },

    getCoinPrices: function(symbol = 'BTC') {
      // HOURLY 
      //https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=10
      fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=10`,)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(data => {
        console.log(data);
        this.prices = data.Data;
        this.getRange();
      });
    },

    getCoins: function() {
      fetch('https://api.coinmarketcap.com/v2/ticker/?limit=10',)
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => {
          this.coins = data.data;
        });
    },

    getRange: function() {
      let max = 0;
      let min = this.prices[0].low;
      this.prices.forEach(x => {
        if(x.high > max) max = x.high;
        if(x.low < min) min = x.low;
      });
      this.max = max;
      this.min = min;
      this.normalizePrices();
    },

    normalizePrices: function() {
      let counter = 0;
      this.pricesNorm = [];
      this.prices.forEach(price => {
        let date = new Date(price.time * 1000);
        date = date.toString().split(' ');
        date = `${date[1]} ${date[2]}`;
        let normPrice = {
          normHigh: 0 + (price.high - this.min) * (390 - 0) / (this.max - this.min),
          normLow: 0 + (price.low - this.min) * (390 - 0) / (this.max - this.min),
          counter,
          date,
          priceHigh: Math.floor(price.high)
        }
        counter += 36;
        this.pricesNorm.push(normPrice);
      });
      console.log(this.prices);
      console.log(this.pricesNorm);
    },

    getCoinImage: function(symbol) {
    }
  }
});
// Normalization
// A = min, B = max
// a = min of range to be normed, b = max of range to be normed
// a + (x - A) * (b - a) / (B - A)