<template>
  <div id="app">
    <h2>{{ currentCoin }}</h2>
    <Graph></Graph>
    <div>
      <button class="title graphButton title-active" v-on:click="changeMode('daily')">1d</button>
      <button class="title graphButton" v-on:click="changeMode('hourly')">1hr</button>
    </div>
    <Table :coins="coins"></Table>
  </div>
</template>

<script>
import Graph from './components/Graph';
import Table from './components/Table';

export default {
// TODO: create news feed
// TODO: implement refresh every 60 sec
// TODO: get images
// TODO: implement low price on bars
// TODO: add user login with firebase
// TODO: add inset to buttons on active
// TODO: reduce num of horiztonal bars to same uniform amount
// TODO: implement line with <path/> option for graph
// TODO: add hover on table
  name: 'app',

  components: {
    Graph, Table
  },

  data() {
    return {
      cmcapikey: process.env.VUE_APP_CMC_KEY,
      nomicsapikey: process.env.VUE_APP_NOMICS_KEY,
      coins: [],
      prices: [],
      pricesNorm: [],
      currentCoin: 'BTC',
      timeMode: 'histoday',
      max: 0,
      min: 0,
      barArray: [],
      coinsArray: [],
      filterByHighest: true,
      hoverBarY: 0
    }
  },

  beforeCreate: function() {
    // this.getCoins();
  },
  created: function() {
    this.getCoins();
  },
  beforeMount: function() {
    // this.getCoins();
  },
  mounted: function() {
    // this.getCoins();
  },

  methods: {
    hoverFunc: function(param) {
      const textToShow = document.getElementById(`textBox${param}`);
      const bgToShow = document.getElementById(`textBoxBG${param}`);
      textToShow.style.opacity = 1;
      bgToShow.style.opacity = 1;
    },

    hoverOutFunc: function(param) {
      const textToHide = document.getElementById(`textBox${param}`);
      const bgToHide = document.getElementById(`textBoxBG${param}`);
      textToHide.style.opacity = 0;
      bgToHide.style.opacity = 0;
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

      let localMin = this.max;
      this.pricesNorm.forEach(x => {
        if(x.priceHigh < localMin) localMin = x.priceHigh;
      })
      
      let divRate = this.max - this.min > 1000 ? 100 : 10
      let highBar = Math.floor(this.max / divRate) * divRate;

      let lowBar = Math.floor(this.min / divRate) * divRate;
    
      let diff = highBar - lowBar;

      let rate = 0;
      if(diff > 1000) rate = 100;
      else if(diff < 1000 && diff > 500) rate = 50;
      else if (diff < 500 && diff > 20) rate = 10;
      else rate = 1;

      for(let max = highBar; max > localMin - rate; max -= rate){
        let text = max;
        let yPos = 0 + (max - this.min) * (390 - 0) / (this.max - this.min);
        this.barArray.push({ text, yPos });
      }
    },

    getCoins: function() {
        // const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD'

        // fetch(CMC_URL, {
        //     method: 'GET',
        //     headers: {
        //       'Access-Control-Allow-Origin': '*', NOT PRESENT ON REQUESTED RESOURCE
        //       'X-CMC_PRO_API_KEY': this.cmcapikey,
        //       'Content-Type': 'application/json',
        //       'Accept-Encoding': 'gzip'
        //     }
        // })
        // .then(res => console.log('res from new request', res))
        // .catch(err => console.warn(err));

        const NOMICS_URL = `https://api.nomics.com/v1/currencies/ticker?key=${this.nomicsapikey}&interval=1d,7d,30d`;
        fetch(NOMICS_URL)
          .then(res => res.json())
          .then(data => {
            this.coins = data.filter((coin, index) => index < 99);
            console.log(this.coins);
          })
          .catch(err => console.warn(err));
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
    calcPos: function() {
      let i = 0;
      this.coinsArray.forEach(coin => {
        coin.pos = i;
        i++;
      });
      this.moveTableBar();
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
          this.calcPos();
          break;
        case 'hourly':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_1h - first.quotes.USD.percent_change_1h);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_1h - second.quotes.USD.percent_change_1h);
          this.filterByHighest = !this.filterByHighest;
          this.calcPos();
          break;
        case 'daily':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_24h - first.quotes.USD.percent_change_24h);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_24h - second.quotes.USD.percent_change_24h);
          this.filterByHighest = !this.filterByHighest;
          this.calcPos();
          break;
        case 'weekly':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_7d - first.quotes.USD.percent_change_7d);
          else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_7d - second.quotes.USD.percent_change_7d);
          this.filterByHighest = !this.filterByHighest;
          this.calcPos();
          break;
        case 'marketCap':
          document.getElementById(param).classList.add('title-active');
          if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.market_cap - first.quotes.USD.market_cap);
          else this.coinsArray.sort((first, second) => first.quotes.USD.market_cap - second.quotes.USD.market_cap);
          this.filterByHighest = !this.filterByHighest;
          this.calcPos();
          break;
      }
    }
  }

}
</script>

<style>

</style>