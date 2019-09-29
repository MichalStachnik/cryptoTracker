<template>
  <ul>
    <li v-for="tag in tags" :key="tag">{{ tag }}</li>
  </ul>
</template>

<script>
export default {
  name: 'Tags',
  props: ['tags'],
  methods: {
    handleTagClick(tag) {
      console.log(tag);
    }
  },
  created() {
    console.log('created tags');
  },
  updated() {
    console.log('in tags', this.tags);
  }
}
</script>

<style scoped>

</style>
