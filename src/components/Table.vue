<template>
    <div class="table">
      <!-- <svg id="table-bg">
        <rect
          id="table-bg-bar"
          x="0"
          v-bind:y="hoverBarY"
          width="100%"
          height="10%"
        >
        </rect>
      </svg> -->
      <div>
        <div class="box"></div>
        <button class="box title tableButton" id="marketCap" v-on:click="titleClick('marketCap')">Market Cap</button>
        <button class="box title tableButton" id="price" v-on:click="titleClick('price')">Current Price</button>
        <button class="box title tableButton" id="hourly" v-on:click="titleClick('hourly')">Hourly Change</button>
        <button class="" id="daily" v-on:click="titleClick('daily')">24 Hour Change</button>
        <button class="" id="weekly" v-on:click="titleClick('weekly')">Weekly Change</button>
      </div>
      <div class="description-row">
        <div></div>
        <div></div>
        <div></div>
        <div>market cap</div>
        <div>price</div>
        <div>1d price change</div>
        <div>7d price change</div>
        <div>30d price change</div>
      </div>
      <!-- <div>
        test
        <br>
        {{ coins[0].price }}
        {{ typeof coins[0].price }}
        {{ coins[0].price | trimNumber }}
      </div> -->
      <div class="row" v-for="coin in coins" v-bind:key="coin.id">
        <div>{{ coin.rank }}</div>
        <div class="img-container">
          <img v-bind:src="coin.logo_url" alt="">
        </div>
        <div class="box" v-on:click="handleClick(coin)">{{ coin.name }}</div>  
        <div class="box">{{ coin.market_cap }}</div>
        <div class="box">{{ coin.price | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['1d']['price_change'] > 0 }" v-if="coin['1d']">{{ coin['1d']['price_change'] | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['7d']['price_change'] > 0 }" v-if="coin['7d']">{{ coin['7d']['price_change'] | trimNumber }}</div>
        <div class="box" v-bind:class="{ positive: coin['30d']['price_change'] > 0 }" v-if="coin['30d']">{{ coin['30d']['price_change'] | trimNumber }}</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['coins'],

  data() {
    return {
      hoverBarY: 0
    }
  },

  created() {
    console.log('created');
    console.log(this.coins);
  },
  
  beforeMount() {
    console.log('beforeMount');
    console.log(this.coins);
  },
  mounted() {
    console.log('mount');
    console.log(this.coins);
    console.log(this.coins[0]);
  },

  methods: {
    handleClick: function(coin) {
      this.currentCoin = coin.symbol;
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
  },

  filters: {
    trimNumber: function(val) {
      return Number(val).toFixed(2);
    },

    // TODO
    // formatMarketCap: function() {

    // }
  },
}
</script>

<style scoped>

  .table {
    width: 95vw;
    margin: 0 auto;
    color: whitesmoke;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 1.2 rem;
    place-items: center center;
    background: #333;
  }

  .row .box {
    justify-self: center;
    /* background: cornflowerblue; */
  }

  .row .positive {
    color: palegreen;
  }

  .row > *:not(.positive) {
    color: darksalmon;
  }


  .row img {
    width: 40px;
    height: 40px;
  }

  .description-row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    place-items: center center;
  }
</style>
