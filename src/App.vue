<template>
  <div id="app">
    <!-- <div>{{  apikey  }}</div> -->
    <h2>{{ currentCoin }}</h2>
      <svg width="40%" viewBox="0 0 440 440">
        <!-- Horiztonal Bars -->
        <g v-for="bar in barArray">
          <text
            x="0"
            v-bind:y="405 - bar.yPos"
          >
            {{ bar.text }}
          </text>
          <!-- NEEDS TO BE FIXED -->
          <rect
            class="bar"
            x="36"
            v-bind:y="400 - bar.yPos"
            height="1"
            width="390"
          >
          </rect>
        </g>
        <!-- Vertical Bars -->
        <g v-for="(price, index) in pricesNorm">
          <rect
            class="textBoxBG"
            v-bind:id="'textBoxBG' + index"
            v-bind:x="price.counter"
            v-bind:y="375 - price.normHigh"
            height="21"
            width="30"
          >
          </rect>
          <text
            class="text"
            v-bind:id="'textBox' + index"
            v-bind:x="price.counter + 3"
            v-bind:y="390 - price.normHigh"
          >
            {{ price.priceHigh }}
          </text>
          <rect 
            class="vertBar"
            v-bind:x="price.counter" 
            v-bind:y="400 - price.normHigh" 
            width="30" 
            v-bind:height="price.normHigh"
            v-on:mouseover="hoverFunc(index)"
            v-on:mouseout="hoverOutFunc(index)"
            v-bind:fill="price.fillColor"
          >
          </rect>
          <text
            v-bind:x="price.counter"
            y="420"
          >
            {{ price.date }}
          </text>
        </g>
      </svg>
      <div>
        <button class="title graphButton title-active" v-on:click="changeMode('daily')">1d</button>
        <button class="title graphButton" v-on:click="changeMode('hourly')">1hr</button>
      </div>
      <div class="container">
        <svg id="tableBG">
          <rect
            id="tableBGBar"
            x="0"
            v-bind:y="hoverBarY"
            width="100%"
            height="10%"
          >
          </rect>
        </svg>
        <div>
          <div class="box"></div>
          <button class="box title tableButton" id="marketCap" v-on:click="titleClick('marketCap')">Market Cap</button>
          <button class="box title tableButton" id="price" v-on:click="titleClick('price')">Current Price</button>
          <button class="box title tableButton" id="hourly" v-on:click="titleClick('hourly')">Hourly Change</button>
          <button class="box title tableButton" id="daily" v-on:click="titleClick('daily')">24 Hour Change</button>
          <button class="box title tableButton" id="weekly" v-on:click="titleClick('weekly')">Weekly Change</button>
        </div>
        <div class="row" v-for="coin in coinsArray">
          <div class="box name" v-on:click="handleClick(coin)">{{ coin.name }}</div>  
          <div class="box">{{ getMarketCap(coin) }}</div>
          <div class="box">{{ coin.quotes.USD.price.toFixed(2) }}</div>
          <div class="box" v-bind:style="getColor(coin.quotes.USD.percent_change_1h)">{{ coin.quotes.USD.percent_change_1h }}%</div>
          <div class="box" v-bind:style="getColor(coin.quotes.USD.percent_change_24h)">{{ coin.quotes.USD.percent_change_24h }}%</div>
          <div class="box" v-bind:style="getColor(coin.quotes.USD.percent_change_7d)">{{ coin.quotes.USD.percent_change_7d }}%</div>
        </div>
    </div>
  </div>
</template>

<script>

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
  data() {
    return {
      // apikey: process.env.VUE_APP_API_KEY
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

  created: function() {
    this.getCoins();
    this.getCoinPrices();
    this.getCoinImage();
  },

  methods: {
    // Change coin on click
    handleClick: function(c) {
      this.currentCoin = c.symbol;
      this.moveTableBar();
      this.getCoinPrices();
    },
    moveTableBar: function() {
      const clickedCoin = this.coinsArray.filter(coin => {
        return coin.symbol === this.currentCoin;
      });
      const clickedCoinPos = clickedCoin[0].pos;
      this.hoverBarY = clickedCoinPos * 49;
    },
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
          let i = 0;
          for(let item in this.coins){
            this.coins[item].pos = i;
            i++;
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
    },

    getColor(num) {
      // return num > 0 ? 'color: #6ff96f;' : 'color: #E94347;';
      return num > 0 ? 'color: lightgreen;' : 'color: salmon;';
    },

  }

}
</script>

<style>

</style>

