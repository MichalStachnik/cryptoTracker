<template>
  <div class="graph">
    <!-- <svg width="40%" viewBox="0 0 440 440">
      <g v-for="bar in candles" v-bind:key="bar.yPos">
        <text
          x="0"
          v-bind:y="405 - bar.yPos"
        >
          {{ bar.text }}
        </text>
        <rect
          class="bar"
          x="36"
          v-bind:y="400 - bar.yPos"
          height="1"
          width="390"
        >
        </rect>
      </g>
      <g v-for="(price, index) in pricesNorm" v-bind:key="index">
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
    <div class="graph-button-container">
      <button class="graph-button" v-on:click="changeMode('daily')">1d</button>
      <button class="graph-button" v-on:click="changeMode('hourly')">1hr</button>
    </div> -->
    <div v-for="candle in candles" :key="candle.time_close">{{ candle }}</div>
  </div>
</template>

<script>
export default {
  name: 'Graph',
  props: ['candles'],

  data() {
    return {
      pricesNorm: [],
      max: 0,
      min: 1000000000000
    }
  },

  mounted() {
    // console.log('mounted graph', this.candles);
  },

  updated() {
    // console.log('updated graph');
    // if (this.candles.length > 0) {
    //   console.log('in graph with candles', this.candles);
    //   this.getRange();
    // }
    // if (this.candles) console.log('updated in graph', this.candles);
  },

  methods: {

    getRange: function() {
      console.log('in get range', this.candles);
      this.candles.forEach(candle => {
        if(candle.price_high > this.max) this.max = candle.price_high;
        if(candle.price_low < this.min) this.min = candle.price_low;
      });

      console.log('max', this.max);
      console.log('min', this.min);
      // this.normalizePrices();
      // this.drawBars();
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
  }
}
</script>


<style scoped>

  .graph {
    grid-area: graph;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4fr 1fr;
  }

  .graph-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .graph-button {
    height: 30px;
    width: 120px;
    cursor: pointer;
    outline: none;
    color: var(--light-blue);
    color: var(--light-pink);
    color: var(--alt-cream);
    background: var(--dark);
    border: 2px solid var(--light-blue);
    border: 2px solid var(--light-pink);
    border: 2px solid var(--alt-cream);
    border-radius: 3px;
    transition: 0.3s all ease-in-out;
  }

  .graph-button:hover {
    background: var(--light-blue);
    background: var(--light-pink);
    background: var(--alt-cream);
    color: var(--dark);
  }

</style>

