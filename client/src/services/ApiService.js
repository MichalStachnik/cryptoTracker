const ApiService = {

  getCoins: () => {
    return fetch('http://localhost:3000/api/coins')
      .then(res => res.json())
      .then(coins => coins);
  },

  getNews:  () => {
    return fetch('http://localhost:3000/api/news')
      .then(res => res.json())
      .then(news => news)
  }
}

export default ApiService;
