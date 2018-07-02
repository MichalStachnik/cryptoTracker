//TODO: create news feed
//TODO: implement refresh every 60 sec
//TODO: get images
//TODO: implement low price on bars
//TODO: add user login with firebase
//TODO: add animation on click to table
//TODO: add inset to buttons on active
//TODO: reduce num of horiztonal bars to same uniform amount
//TODO: add functionality to market cap button
//TODO: implement line with <path/> option for graph

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
    coinsArray: [],
    filterByHighest: true
  },

  created: function() {
    this.getCoins();
    this.getCoinPrices();
    this.getCoinImage();
  },

  methods: {
    // Change coin on click
    handleClick: function(c) {
      this.currentCoin = c.symbol;
      this.getCoinPrices();
    },
    
    hoverFunc: function(param) {
      const textToShow = document.getElementById('textBox' + param);
      textToShow.style.opacity = 1;
    },

    hoverOutFunc: function(param) {
      const textToHide = document.getElementById('textBox' + param);
      textToHide.style.opacity = 0;
    },

    // Change timeMode on click
    changeMode: function(m) {
      const graphButtons = document.querySelectorAll('.graphButton');
      graphButtons.forEach(button => button.classList.remove('title-active'));
      if(m === 'daily') {
        graphButtons[0].classList.add('title-active');
        this.timeMode = 'histoday';
      }
      if(m === 'hourly') {
        graphButtons[1].classList.add('title-active');
        this.timeMode = 'histohour';
      }
      this.getCoinPrices();
    },

    drawBars: function() {
      this.barArray = []; 
      // console.log(this.max, this.min);

      let localMin = this.max;
      this.pricesNorm.forEach(x => {
        if(x.priceHigh < localMin) localMin = x.priceHigh;
      })
      
      // console.log(localMin);
      let divRate = this.max - this.min > 1000 ? 100 : 10
      let highBar = Math.floor(this.max / divRate) * divRate;
      // console.log('HIGHBAR', highBar);

      let lowBar = Math.floor(this.min / divRate) * divRate;
      // console.log('LOWBAR',lowBar);
    
      let diff = highBar - lowBar;
      // console.log('diff', diff);
      let rate = 0;
      if(diff > 1000) rate = 100;
      else if(diff < 1000 && diff > 500) rate = 50;
      else if (diff < 500 && diff > 20) rate = 10;
      else rate = 1;
      console.log('RATE', rate);
      for(let max = highBar; max > localMin - rate; max -= rate){
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
          console.log('getCoinPrices', data);
          this.prices = data.Data;
          this.getRange();
        });
    },

    getCoins: function() {
      fetch('https://api.coinmarketcap.com/v2/ticker/?limit=10')
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => {
          console.log('getCoins', data)
          this.coins = data.data;
          // Build usable array for sorting
          for(let item in this.coins){
            this.coinsArray.push(this.coins[item]);
          }
        });
        console.log(this.coinsArray);
    },

    getCoinImage: function() {

      // fetch('https://www.cryptocompare.com/api/data/coinlist')
      //   .then(res => res.json())
      //   .catch(err => console.log(err))
      //   .then(data => {
      //     console.log('DATA');
      //     console.log(data);
      //   });
      
    },

    getMarketCap: function(coin) {

      // Format market cap
      let marketCapString = coin.quotes.USD.market_cap.toString();
      let marketCapArr = marketCapString.split('');
      let newMarketCap = '';
      for(let i = marketCapArr.length - 1, iterator = 1; i > -1; i--, iterator++){
        if(iterator % 3 === 0){
          newMarketCap = marketCapArr[i] + newMarketCap;
          if(i > 0){
            newMarketCap = ',' + newMarketCap;
          }
        }
        else newMarketCap = marketCapArr[i] + newMarketCap;    
      }
      return newMarketCap;
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
      console.log('this.prices', this.prices);
      this.prices.forEach((price, index) => {
        let date = new Date(price.time * 1000);
        date = date.toString().split(' ');
        if(this.timeMode === 'histoday') date = `${date[1]} ${date[2]}`;
        if(this.timeMode === 'histohour') date = `${date[4].slice(0,5)}`;
        
        // let fillColor = '90ee90';
        let fillColor = 'lightgreen';
        if(this.prices[index - 1] && price.high < this.prices[index - 1].high){
          // fillColor = 'e943347';
          fillColor = 'salmon';
        }
        let normPrice = {
          normHigh: 0 + (price.high - this.min) * (390 - 0) / (this.max - this.min),
          normLow: 0 + (price.low - this.min) * (390 - 0) / (this.max - this.min),
          counter,
          date,
          priceHigh: Math.floor(price.high),
          fillColor
        }
        counter += 36;
        this.pricesNorm.push(normPrice);
      });
    },

    titleClick: function(param) {
      //Sort by title click and add/remove style
      document.querySelectorAll('.tableButton').forEach(title => title.classList.remove('title-active'));
      switch (param){
        case 'price':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.price - first.quotes.USD.price);
          else this.coinsArray.sort((first, second) => first.quotes.USD.price - second.quotes.USD.price);
          this.filterByHighest = !this.filterByHighest;
          break;
        case 'hourly':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_1h - first.quotes.USD.percent_change_1h);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_1h - second.quotes.USD.percent_change_1h);
          this.filterByHighest = !this.filterByHighest
          break;
        case 'daily':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_24h - first.quotes.USD.percent_change_24h);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_24h - second.quotes.USD.percent_change_24h);
          this.filterByHighest = !this.filterByHighest
          break;
        case 'weekly':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_7d - first.quotes.USD.percent_change_7d);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_7d - second.quotes.USD.percent_change_7d);
          this.filterByHighest = !this.filterByHighest
          break;
        case 'marketCap':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.market_cap - first.quotes.USD.market_cap);
          else this.coinsArray.sort((first, second) => first.quotes.USD.market_cap - second.quotes.USD.market_cap);
          this.filterByHighest = !this.filterByHighest
          break;
      }
    },

    getColor(num) {
      // return num > 0 ? 'color: #6ff96f;' : 'color: #E94347;';
      return num > 0 ? 'color: lightgreen;' : 'color: salmon;';
    },

  }
});