<template lang="pug">
  #app.container
    // header
    header.row
      .col-2
        .logo
          span Почти
          h1 Авито
      .col-10
        input.search(
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
              div.favorite(
                @click="changeFavoriteList(item)"
              )
                font-awesome-icon(:icon="['fas', 'heart']" v-if="isFavorite(item)")
                font-awesome-icon(:icon="['far', 'heart']" v-else)
            .card-body
              h5.card-title
                a(href="#") {{ item.title }}
              p.card-text(v-if="item.price") Цена: {{ item.price | priceFormat }}
              p.card-text(v-else) Цена не указана
            .card-footer
              p.card-text {{ sellersList[item.relationships.seller].name | trim }}
              p.card-text ({{ sellersList[item.relationships.seller].rating }})

      // Aside
      .col-3
        aside
          h4 Фильтры
          .input-group
            input(type="checkbox" aria-label="Checkbox for following text input" v-model="favoriteFilter")
            label Только избранные

          ul.list-group
            li.list-group-item(
              v-for="(value, name) in categories"
              :class="{ 'active': chooseCategory === name }"
              @click="chooseCategory = name"
            ) {{ value }}

          .input-group
            p по цене
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
            button.btn.btn-primary(
              type="button"
              @click="sortingProductsByRating"
            ) по рейтингу продавца
            button.btn.btn-primary(
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
      allProductList: [],
      sellersList: [],
      favoriteList: [],
      favoriteFilter: false,
      // API's EndPoints
      links: {
        products: 'http://avito.dump.academy/products',
        product: 'http://avito.dump.academy/products/:product_id',
        sellers: 'http://avito.dump.academy/sellers',
        seller: 'http://avito.dump.academy/sellers/:seller_id'
      },
      // Filter's data
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
    // API
    getSellers () {
      axios.get(this.links.sellers)
        .then(response => (this.sellersList = response.data.data))
        .catch(error => console.error(error))
    },
    getProducts () {
      axios.get(this.links.products)
        .then(response => (this.allProductList = response.data.data))
        .catch(error => console.error(error))
    },

    // Sorting
    sortingProductsByPrice () {
      this.productsItems.sort((a, b) => (a.price - b.price))
    },
    sortingProductsByRating () {
      this.productsItems.sort((a, b) => (
        this.sellersList[a.relationships.seller].rating - this.sellersList[b.relationships.seller].rating)
      ).reverse()
    },

    // work with a Favorite list
    loadingLocalFavoriteList () {
      if (localStorage.getItem('favList')) {
        try {
          this.favoriteList = JSON.parse(localStorage.getItem('favList'))
        } catch (e) {
          localStorage.removeItem('favList')
        }
      }
    },
    saveLocalFavoriteList () {
      const parsed = JSON.stringify(this.favoriteList)
      localStorage.setItem('favList', parsed)
    },
    changeFavoriteList (item) {
      let index = this.favoriteList.findIndex((element, index, array) => {
        return item.id === element.id
      })
      if (index === -1) {
        this.favoriteList.push(item)
      } else {
        this.favoriteList.splice(index, 1)
      }
      this.saveLocalFavoriteList()
    },
    isFavorite (item) {
      return this.favoriteList.includes(item)
    }
  },
  mounted () {
    axios.all([
      this.getSellers(),
      this.getProducts()
    ]).then(this.loadingLocalFavoriteList())
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
    },
    trim (string) {
      let maxStringLength = 15
      if (string.length > maxStringLength) {
        return string.slice(0, maxStringLength) + '...'
      } else {
        return string
      }
    }
  },
  computed: {
    // current product list
    productsItems () {
      if (this.favoriteFilter) {
        return this.favoriteList
      } else {
        return this.allProductList
      }
    },
    // filtred current product list
    filtredProducts () {
      return this.productsItems
        // Search filter
        .filter(item => {
          return ~item.title.toLowerCase().indexOf(this.search)
        // Category filter
        }).filter(item => {
          return (this.chooseCategory === 'all') ? true : ~item.category.indexOf(this.chooseCategory)
        // minPrice filter
        }).filter(item => {
          return this.minPrice ? item.price > this.minPrice : true
        // maxPrice filter
        }).filter(item => {
          return this.maxPrice ? item.price < this.maxPrice : true
        })
    }
  }
}
</script>

<style lang="scss">

@import "./styles/custom-bootstrap";

p {
  margin: 0.2rem;
}

header {
  input {
    margin: 8px;

    &.search {
      display: block;
      width: 100%;
      height: calc(1.5em + 0.75rem + 2px);
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      color: #495057;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
  }
}

.input-group, .list-group {
  margin: 25px 0;

  input[type="checkbox"] {
    margin: 7px;
  }

  p{
    margin-bottom: 3px;
    width: 100%;
  }
}

.btn-group-vertical {
  width: 100%;
}

.logo {
  text-align: right;
  span {
    display: block;
    margin-bottom: -18px;
    font-size: 12px;
    color: $primary
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

    .favorite {
      display: block;
      position: absolute;
      top: 10px;
      right: 10px;
      color: $primary
    }

    .card-pictures-count {
      display: block;
      position: absolute;
      bottom: 10px;
      left: 10px;
      width: 25px;
      height: 25px;
      background-color: $primary;
      border-radius: 50%;
      text-align: center;
      opacity: .85;
      box-shadow: 3px 3px 6px 0px rgba(0,0,0,0.49);
    }
  }

  .card-body {
    padding: .5rem;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    padding: .7rem .5rem;
  }
}
</style>
