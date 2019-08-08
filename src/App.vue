<template lang="pug">
  #app.container
    // header
    header.row
      .col-2
        .logo
          span Почти
          h1 Авито
      .col-10
        input.form-control(
          type="text"
          aria-label="Поиск"
          v-model="search"

        )

    // cards
    .row
      .col-9
        main.card-deck
          .card(v-for="item in filtredProducts")
            .card-header
              img.card-img-top(:src="item.pictures[0]" alt="item.title")
              p.card-pictures-count +{{ (item.pictures.length-1) }}
            .card-body
              h5.card-title
                a(href="#") {{ item.title }}
              p.card-text(v-if="item.price") Цена: {{ item.price | priceFormat }}
              p.card-text(v-else) Цена не указана
              p.card-text {{ item.category }}
            .card-footer
              p.card-text {{ sellersList[item.relationships.seller].name }}
              p.card-text ({{ sellersList[item.relationships.seller].rating }})

      // Aside
      .col-3
        aside
          h4 Фильтры
          .input-group
            input(type="checkbox" aria-label="Checkbox for following text input")
            label Избранные

          p По категории
          ul.list-group(v-for="(value, name) in categories")
            li.list-group-item(
              :class="{ 'active': chooseCategory === name }"
              @click="chooseCategory = name"
            ) {{ value }}

          p по цене
          .input-group
            input.form-control(
              type="text"
              aria-label="First name"
              placeholder="С"
              v-model.number="minPrice")
            input.form-control(
              type="text"
              aria-label="Last name"
              placeholder="до"
              v-model.number="maxPrice")

          h4 Сортировать
          .btn-group-vertical.mr-2(role="group" aria-label="Second group")
            button.btn.btn-secondary(
              type="button"
              @click="sortingProductsByRating"
            ) по рейтингу продавца
            button.btn.btn-secondary(
              type="button"
              @click="sortingProductsByPrice"
            ) по возрастанию цены
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      productsItems: [],
      sellersList: [],
      links: {
        products: 'http://avito.dump.academy/products',
        product: 'http://avito.dump.academy/products/:product_id',
        sellers: 'http://avito.dump.academy/sellers',
        seller: 'http://avito.dump.academy/sellers/:seller_id'
      },
      categories: {
        all: 'Все',
        immovable: 'Недвижимость',
        cameras: 'Фотоаппараты',
        auto: 'Автомобили',
        laptops: 'Ноутбуки'
      },
      chooseCategory: 'all',
      search: '',
      minPrice: null,
      maxPrice: null
    }
  },
  methods: {
    getSellers () {
      axios.get(this.links.sellers)
        .then(response => (this.sellersList = response.data.data))
        .catch(error => console.error(error))
    },
    getProducts () {
      axios.get(this.links.products)
        .then(response => (this.productsItems = response.data.data))
        .catch(error => console.error(error))
    },
    sortingProductsByPrice () {
      this.productsItems.sort((a, b) => (a.price - b.price))
    },
    sortingProductsByRating () {
      this.productsItems.sort((a, b) => (
        this.sellersList[a.relationships.seller].rating - this.sellersList[b.relationships.seller].rating)
      ).reverse()
    }
  },
  mounted () {
    axios.all([
      this.getSellers(),
      this.getProducts()
    ])
  },
  filters: {
    priceFormat (value) {
      let options = {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }

      let numberFormat = new Intl.NumberFormat('ru-RU', options)
      return numberFormat.format(value)
    }
  },
  computed: {
    filtredProducts () {
      return this.productsItems
        // Search
        .filter(item => {
          return ~item.title.toLowerCase().indexOf(this.search)
        }).filter(item => {
          return (this.chooseCategory === 'all') ? true : ~item.category.indexOf(this.chooseCategory)
        }).filter(item => {
          return this.minPrice ? item.price > this.minPrice : true
        }).filter(item => {
          return this.maxPrice ? item.price < this.maxPrice : true
        })
    }
  }
}
</script>

<style lang="scss">

@import "./styles/custom-bootstrap";

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  .row {
    display: flex;
    flex-wrap: wrap;
  }
}

header {
  input {
    margin: 8px;
  }
}

.input-group {
  margin: 5px;
}

.logo{
  text-align: right;
  span {
    display: block;
    margin-bottom: -18px;
    font-size: 12px;
  }
}

.card {
  min-width: calc(33% - 30px);
  margin: 10px;
  box-shadow: 3px 3px 6px 0px rgba(0,0,0,0.2);
  max-width: calc(33% - 30px);

  .card-header {
     position: relative;
      width: 100%;
      padding: 0;
       box-shadow: inset 0px -30px 5px 0px rgba(255,255,255,1);
  }

  .card-body {
    padding: .5rem;
  }

  .card-pictures-count {
    display: block;
    position: absolute;
    bottom: 10px;
    right: 25px;
    width: 25px;
    height: 25px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    opacity: .85;
    box-shadow: 3px 3px 6px 0px rgba(0,0,0,0.49);
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    padding: .7rem .5rem;
  }
}
</style>
