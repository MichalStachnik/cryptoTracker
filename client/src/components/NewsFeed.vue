<template>
  <div class="news-feed">
    <ul>
      <li
        v-for="newsObject in news"
        v-bind:key="newsObject.id"
        @click="handleNewsClick(newsObject)"
      >
        <div>
          <i class="material-icons" :class="{ rotate: newsObject.id == selected }">chevron_right</i>
        </div>
        <p>{{ newsObject.title }}</p>
        <div class="body" :class="{ isActive: newsObject.id == selected }">
          {{ newsObject.body }}
        </div>
        <span class="time">
          <code>
          {{ computeDate(newsObject.published_on) }}
          </code>
        </span>
        <span class="publisher">
          <code>
            <a :href="newsObject.url" target="_blank">{{ newsObject.source }}</a>
          </code>
        </span>
        <!-- <span class="tags">
          {{ getTags(newsObject.categories) }}
        </span> -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NewsFeed',
  props: ['news'],
  data() {
    return {
        isShowing: false,
        selected: undefined
    }
  },

  mounted () {},

  updated () {
    console.log('updated newsfeed', this.news)
  },

  methods: {

    handleNewsClick: function(newsObject) {
      if (this.selected !== newsObject.id) this.selected = newsObject.id;
      else this.selected = undefined;
    },

    computeDate: function(publishedOn) {
      const date = new Date(publishedOn * 1000)
      return `${date.getHours()}:${date.getMinutes()}`
    },

    getTags: function(categories) {
      const tags = categories.split('|')
      let tagsString = ''

      tags.forEach(tag => {
          tagsString += ` ${tag}`
      })
      return tagsString
    }
  }
}

</script>

<style scoped>
  .news-feed {
    grid-area: news;
    height: 100%;
    overflow: scroll;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  li {
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 5px;
    background: var(--primary);
    color: var(--white);
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr auto 1fr;
    grid-template-areas:
      "button title title title title title"
      "body body body body body body"
      "time time time publisher publisher publisher";
  }

  li:hover {
    cursor: pointer;
  }

  li:nth-child(odd) {
    background: var(--primary);
    color: var(--white);
  }

  li p {
    grid-area: title;
    margin: 0;
  }

  li span.time {
    grid-area: time;
    place-self: end start;
    background: var(--light-pink);
    color: var(--dark);
    padding: 4px;
    border-radius: 3px;
  }

  li span.publisher {
    grid-area: publisher;
    place-self: end;
    background: var(--light-pink);
    padding: 4px;
    border-radius: 3px;
  }

  li span.publisher a {
    text-decoration: none;
    color: var(--dark);
  }

  .body {
    grid-area: body;
    height: 0px;
    overflow: hidden;
    background: var(--dark);
    color: var(--white);
    padding: 0px;
    border-radius: 3px;
    box-sizing: border-box;
    opacity: 0;
  }

  .isActive {
    height: 100%;
    padding: 10px;
    opacity: 1;
  }

  div.button {
    grid-area: button;
  }

  i {
    transition: 0.2s all ease-in-out;
  }

  i.rotate {
    transform: rotate(90deg);
  }

</style>
