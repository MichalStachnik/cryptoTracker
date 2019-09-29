<template>
  <div class="search-bar">
    <input required type="text" name="searchTerm" v-model="searchTerm" @input="handleInputChange()">
    <label for="searchTerm">
      <span>Search...</span>
    </label>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'SearchBar',

  data() {
    return {
      searchTerm: ''
    }
  },

  methods: {

    handleInputChange: _.debounce(function() {
        this.$emit('inputChanged', this.searchTerm);
    }, 500)

  }
}
</script>

<style scoped>

  .search-bar {
    grid-area: search;
    position: relative;
    place-self: center start;
    overflow: hidden;
  }

  input {
    height: 30px;
    width: 200px;
    padding: 20px 0 0 0;
    border: 0;
    outline: none;
    background: var(--dark);
    color: var(--white);
    border-bottom: 2px solid var(--primary);
  }

  label {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transition: 0.5s all ease-in-out;
    font-size: 14px;
  }

  label::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-bottom: 2px solid var(--light-pink);
    transform: translateX(-100%);
    transition: all 0.3s ease-in-out;
  }

  label span {
    position: absolute;
    top: 50%;
    left: 8%;
    transition: 0.5s all ease-in-out;
    color: var(--white);
  }

  input:focus + label span, input:valid + label span {
    transform: translate(-20px, -17px) scale(0.75);
    color: var(--shade);
  }

  input:focus + label::after, input:valid + label::after {
    transform: translateX(0%);
  }
  
</style>
