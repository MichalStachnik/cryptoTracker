//TODO: create news feed
//TODO: implement refresh every 60 sec
//TODO: get image and finish table
//TODO: add transitions on change
//TODO: implement low price on bars
//TODO: make svg responsive
//TODO: make filter buttons
//TODO: add user login with firebase
//TODO: add hover on bars

let app = new Vue({
  el: "#app",
  data: {
    coins: [],
    prices: [],
    pricesNorm: [],
    currentCoin: 'BTC',
    timeMode: 'histoday',
    max: 0,
    min: 0,
    barArray: [],
    coinsArray: []
  },

  created: function() {
    this.getCoins();
    this.getCoinPrices();
  },

  methods: {

    // Change coin on click
    handleClick: function(c) {
      this.currentCoin = c.symbol;
      this.getCoinPrices();
    },

    // Change timeMode on click
    changeMode: function(m) {
      if(m === 'daily') this.timeMode = 'histoday';
      if(m === 'hourly') this.timeMode = 'histohour';
      this.getCoinPrices();
    },
    drawBars: function() {
      // TODO: Make work for range 0 - 10
      this.barArray = []; 
      console.log(this.max, this.min);
      let divRate = this.max > 1000 ? 100 : 10
      // Get highest bar
      let highBar = Math.floor(this.max / divRate) * divRate;
      console.log(highBar);

      // Get low bar
      let lowBar = Math.floor(this.min / divRate) * divRate;
      console.log('LOWBAR',lowBar);
    
      let diff = highBar - lowBar;
      console.log(diff);
      let rate = 0;
      if(diff > 1000) rate = 100;
      else rate = 10;
      for(let max = highBar; max > lowBar; max -= rate){
        let text = max;
        let yPos = 0 + (max - this.min) * (390 - 0) / (this.max - this.min);
        this.barArray.push({ text, yPos });
      }
    },
    getCoinPrices: function() {

      let fetchURL = `https://min-api.cryptocompare.com/data/${this.timeMode}?fsym=${this.currentCoin}&tsym=USD&limit=10`;

      fetch(fetchURL)
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
          // Build usable array for sorting
          for(let item in this.coins){
            this.coinsArray.push(this.coins[item]);
          }

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
      this.drawBars();
    },

    normalizePrices: function() {
      let counter = 36;
      this.pricesNorm = [];
      this.prices.forEach(price => {
        let date = new Date(price.time * 1000);
        date = date.toString().split(' ');
        if(this.timeMode === 'histoday') date = `${date[1]} ${date[2]}`;
        if(this.timeMode === 'histohour') date = `${date[4].slice(0,5)}`;
        
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
    },
    titleClick: function(param) {
      //Sort by title click
      switch (param){
        case 'price':
          this.coinsArray.sort((first, second) => second.quotes.USD.price - first.quotes.USD.price);
          break;
        case 'hourly':
          this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_1h - first.quotes.USD.percent_change_1h);
          break;
        case '24':
          this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_24h - first.quotes.USD.percent_change_24h);
          break;
        case 'weekly':
          this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_7d - first.quotes.USD.percent_change_7d);
          break;
      }
    },

    getCoinImage: function(symbol) {
    }
  }
});