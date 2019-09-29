<template>
  <div id="app">
    <div class="top">
      <Graph v-bind:candles="candles"></Graph>
      <SearchBar @inputChanged="parentInputChangeHandler"></SearchBar>
      <Tags></Tags>
      <NewsFeed :news="filteredNews"></NewsFeed>
    </div>
    <Table :filteredCoins="filteredCoins" @coinClicked="parentCoinClickHandler"></Table>
  </div>
</template>

<script>
import Graph from './components/Graph';
import Table from './components/Table';
import SearchBar from './components/SearchBar';
import NewsFeed from './components/NewsFeed';
import Tags from './components/Tags';

import ApiService from './services/ApiService';

export default {
// TODO: implement refresh every 60 sec
// TODO: add inset to buttons on active
// TODO: implement line with <path/> option for graph
// TODO: make PWA / web manifest file
// TODO: add routes & codesplit from video, since we are using webpack we can async import components
// TODO: add debounce with lodash?

  name: 'app',

  components: {
    Graph, Table, SearchBar, NewsFeed, Tags
  },

  data() {
    return {
      cmcapikey: process.env.VUE_APP_CMC_KEY,
      nomicsapikey: process.env.VUE_APP_NOMICS_KEY,
      coins: [],
      filteredCoins: [],
      news: [],
      filteredNews: [],
      candles: [],
      tags: []
    }
  },

  beforeCreate: function() {},
  created: function() {
    this.getCoins();
    this.getNews();
    // this.getCandleForCoin('BTC');
  },
  beforeMount: function() {},
  mounted: function() {},

  methods: {

    getCoins: function() {
      ApiService.getCoins()
        .then(res => {
          this.coins = res;
          this.filteredCoins = this.coins.filter((c, index) => index < 100);
        })
        .catch((err) => console.warn(err));
    },

    getNews: function() {
      ApiService.getNews()
        .then(res => {
          this.news = res.Data;
          this.filteredNews = res.Data;
          console.log('filteredNews', this.filteredNews);
          
          // Create tags
          this.filteredNews.forEach((news) => {

          });
        })
        .catch(err => console.warn(err));
    },

    getCandleForCoin: function(symbol) {
      fetch(`http://localhost:3000/api/getCandle/${symbol}`)
        .then(res => res.json())
        .then(candles => {
          this.candles = candles;
        })
        .catch(err => console.warn(err));
    },

    parentInputChangeHandler(newInput) {
      // network request happening for .jpgs
      let lowercaseInput = newInput.toLowerCase().trim();
      if (newInput.length > 0) {
        // Filtering table
        this.filteredCoins = this.coins.filter((coin) => {
          if (coin.name) {
            return coin.name.toLowerCase().includes(lowercaseInput);
          }
        });
        // Filtering news
        this.filteredNews = this.filteredNews.filter(article => {
          return article.body.toLowerCase().includes(lowercaseInput) || article.title.toLowerCase().includes(lowercaseInput);
        });
      } else {
        this.filteredCoins = this.coins.filter((coin, index) => index < 100);
        this.filteredNews = this.news;
      }
    },

    parentCoinClickHandler(symbol) {
      this.getCandleForCoin(symbol);
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

    calcPos: function() {
      let i = 0;
      this.coinsArray.forEach(coin => {
        coin.pos = i;
        i++;
      });
      this.moveTableBar();
    }

  },
  computed: {
  }
}
</script>

<style>

:root{
  --primary: #2C3339;
  --dark: #222326;
  --shade: #627280;
  --secondary: #78C0FF;
  --dark-blue: #396C99;
  --light-blue: #C4FFFB;
  --light-pink: #FF9C85;
  --white: #EBEDF3;
  --green: #73D98C;

  --alt-white: #F2E6D0;
  --alt-cream: #F2C6AC;
  --alt-red: #F27D72;
}

body {
  margin: 0;
  padding: 0;
  /* we can add padding and border to our elements without increasing their size */
  box-sizing: border-box;
}

#app {
  background: var(--dark);
  background: linear-gradient(var(--dark), var(--primary));
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 5vh 50vh;
  grid-gap: 10px;
  grid-template-areas:
    "graph graph search tags"
    "graph graph news news";
  place-items: center center;
  width: 95vw;
  margin: 0 auto;
}

</style>
