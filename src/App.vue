<template lang="pug">
  #app.container
      .row
        h1 hello, world!
      .row
        .col
          | 1 of 3
        .col-6
          | 2 of 3 (wider)
        .col
          | 3 of 3
      .row
        .col
          | 1 of 3
        .col-5
          | 2 of 3 (wider)
        .col
          | 3 of 3
      .row
        pre
          p {{ info }}
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      info: null,
      links: {
        products: 'http://avito.dump.academy/products',
        product: 'http://avito.dump.academy/products/:product_id',
        sellers: 'http://avito.dump.academy/sellers',
        seller: 'http://avito.dump.academy/sellers/:seller_id'
      }
    }
  },
  mounted () {
    axios
      .get(this.links.products)
      .then(response => (this.info = response))
  }
}
</script>

<style lang="scss">

@import "./styles/custom-bootstrap";

</style>
