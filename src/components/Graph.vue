<template>
    <svg width="40%" viewBox="0 0 440 440">
      <g v-for="bar in barArray" v-bind:key="bar.yPos">
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
</template>

<script>
export default {
  name: 'Graph',

  data() {
    return {
      barArray: [],
      pricesNorm: []
    }
  },

  mehods: {
  }
}
</script>


<style scoped>

</style>

