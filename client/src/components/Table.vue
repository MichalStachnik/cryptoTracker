<template>
    <div class="table">
      <div v-if="isLoading" class="loaders">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="filter-row">
        <div v-on:click="filterClick('rank')">rank</div>
        <div></div>
        <div v-on:click="filterClick('price')"></div>
        <div v-on:click="filterClick('market cap')">market cap</div>
        <div v-on:click="filterClick('price')">price</div>
        <div v-on:click="filterClick('1d')">1d price change</div>
        <div v-on:click="filterClick('7d')">7d price change</div>
        <div v-on:click="filterClick('30d')">30d price change</div>
      </div>
      <div class="row" v-for="coin in filteredCoins" :key="coin.id" @click="handleCoinClick(coin)">
        <div>{{ coin.rank }}</div>
        <div class="img-container">
          <!-- <img v-bind:src="coin.logo_url" alt=""> -->
        </div>
        <div class="box">{{ coin.name }}</div>  
        <div class="box">{{ coin.market_cap | formatMarketCap }}</div>
        <div class="box">{{ coin.price | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['1d']['price_change'] > 0, negative: coin['1d']['price_change'] < 0 }" v-if="coin['1d']">{{ coin['1d']['price_change'] | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['7d']['price_change'] > 0, negative: coin['7d']['price_change'] < 0 }" v-if="coin['7d']">{{ coin['7d']['price_change'] | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['30d']['price_change'] > 0, negative: coin['30d']['price_change'] < 0}" v-if="coin['30d']">{{ coin['30d']['price_change'] | trimNumber }}</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['filteredCoins'],

  data() {
    return {
      hoverBarY: 0,
      isAscending: false,
      isLoading: true,
      coins: []
    }
  },

  created() {
    this.isLoading = true;
  },

  updated() {
    if (this.filteredCoins.length > 0) {
      this.isLoading = false;
    }
  },

  methods: {

    titleClick: function() {},

    filterClick: function(filter) {
        if (filter === '1d') {
          this.coins = this.coins.sort((a, b) => {
              if (a['1d'] && b['1d']) {
                if (this.isAscending) return a['1d']['price_change'] - b['1d']['price_change'];
                else return b['1d']['price_change'] - a['1d']['price_change'];
              }
          });
        }

        if (filter === '7d') {
          this.coins = this.coins.sort((a, b) => {
            if (a['7d'] && b['7d']) {
              if (this.isAscending) return a['7d']['price_change'] - b['7d']['price_change'];
              else return b['7d']['price_change'] - a['7d']['price_change'];
            }
          });
        }

        this.isAscending = !this.isAscending;
    },

    handleCoinClick: function(coin) {
      // this.currentCoin = coin.symbol;
      // this.moveTableBar();
      // this.getCoinPrices();
      this.$emit('coinClicked', coin.symbol);
    },

    handleInputChange: function() {
      this.$emit('inputChanged', this.searchTerm);
    },

    moveTableBar: function() {
      const clickedCoin = this.coinsArray.filter(coin => {
        return coin.symbol === this.currentCoin;
      });
      const clickedCoinPos = clickedCoin[0].pos;
      this.hoverBarY = clickedCoinPos * 49;
    },
    
    // titleClick: function(param) {
    //   //Sort by title click and add/remove style
    //   document.querySelectorAll('.tableButton').forEach(title => title.classList.remove('title-active'));
    //   switch (param){
    //     case 'price':
    //       document.getElementById(param).classList.add('title-active');
    //       if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.price - first.quotes.USD.price);
    //       else this.coinsArray.sort((first, second) => first.quotes.USD.price - second.quotes.USD.price);
    //       this.filterByHighest = !this.filterByHighest;
    //       this.calcPos();
    //       break;
    //     case 'hourly':
    //       document.getElementById(param).classList.add('title-active');
    //       if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_1h - first.quotes.USD.percent_change_1h);
    //       else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_1h - second.quotes.USD.percent_change_1h);
    //       this.filterByHighest = !this.filterByHighest;
    //       this.calcPos();
    //       break;
    //     case 'daily':
    //       document.getElementById(param).classList.add('title-active');
    //       if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_24h - first.quotes.USD.percent_change_24h);
    //       else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_24h - second.quotes.USD.percent_change_24h);
    //       this.filterByHighest = !this.filterByHighest;
    //       this.calcPos();
    //       break;
    //     case 'weekly':
    //       document.getElementById(param).classList.add('title-active');
    //       if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.percent_change_7d - first.quotes.USD.percent_change_7d);
    //       else this.coinsArray.sort((first, second) => first.quotes.USD.percent_change_7d - second.quotes.USD.percent_change_7d);
    //       this.filterByHighest = !this.filterByHighest;
    //       this.calcPos();
    //       break;
    //     case 'marketCap':
    //       document.getElementById(param).classList.add('title-active');
    //       if(this.filterByHighest) this.coinsArray.sort((first, second) => second.quotes.USD.market_cap - first.quotes.USD.market_cap);
    //       else this.coinsArray.sort((first, second) => first.quotes.USD.market_cap - second.quotes.USD.market_cap);
    //       this.filterByHighest = !this.filterByHighest;
    //       this.calcPos();
    //       break;
    //   }
    // }
  },

  filters: {

    trimNumber: function(val) {
      return Number(val).toFixed(2);
    },

    formatMarketCap: function(price) {
      // Format market cap
      if(price) {
        price = price.slice(0, -3);
        let marketCapArr = price.split('');
        let newMarketCap = '';
        for(let i = marketCapArr.length - 1, iterator = 1; i > -1; i--, iterator++){
          if(iterator % 3 === 0){
            newMarketCap = marketCapArr[i] + newMarketCap;
            if(i > 0){
              newMarketCap = ',' + newMarketCap;
            }
          } else {
            newMarketCap = marketCapArr[i] + newMarketCap; 
          }
      }
      return newMarketCap;
      }
    }
  },
}
</script>

<style scoped>

  .table {
    width: 95vw;
    min-height: 60vh;
    position: relative;
    margin: 0 auto;
    background: var(--primary);
    color: var(--white);
    border: 2px solid var(--light-pink);
    border-radius: 4px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 2fr 2fr 2fr 2fr 2fr;
    grid-template-rows: 45px;
    place-items: center center;
    background: var(--primary);
    color: var(--white);
    transition: 0.4s all ease-in-out;
  }

  .row:nth-child(even) {
    background: var(--dark);
    color: var(--white);

  }

  .row:hover {
    background: var(--white);
    color: var(--dark);
  }

  .row .box {
    justify-self: center;
  }

  .row .positive {
    color: var(--green);
  }

  .row .negative {
    color: var(--alt-red);
  }

  .row img {
    width: 35px;
    height: 35px;
  }

  .filter-row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    place-items: center center;
    background: var( --alt-blue);
  }

  .loaders {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .loaders span {
    display: inline-block;
    /* height: 20px; */
    height: 4px;
    width: 0px;
    border-radius: 50%;
    border: 2px solid;
    border-color: var(--light-pink);
    animation: spinning 0.6s linear infinite;
    transform-origin: center;
  }

  .loaders span:nth-child(1) {
    animation-delay: 0;
  }

  .loaders span:nth-child(2) {
    animation-delay: 0.05s;
    margin-left: 5px;
    margin-right: 5px;
  }

  .loaders span:nth-child(3) {
    animation-delay: 0.1s;
  }



  @keyframes spinning {
    0% {
      transform: rotate(0deg) translateY(0px);
    }
    25% {
      transform: rotate(90deg) translateY(2px);
    }
    50% {
      transform: rotate(180deg) translateY(4px);
    }
    75% {
      transform: rotate(270deg) translateY(2px);
    }
    100% {
      transform: rotate(360deg) translateY(0px);
    }
  }

</style>
