<template lang="pug">
  #app.container
    header.row
      .col-2
        .logo
          span Почти
          h1 Авито
      .col-10
        input.form-control(type="text" aria-label="Поиск")

    .row
      .col-9
        main.card-deck
          .card(v-for="item in items")
            .card-header
              img.card-img-top(:src="item.pictures[0]" alt="item.title")
              p.card-pictures-count +{{ (item.pictures.length-1) }}
            .card-body
              h5.card-title {{ item.title }}
              p.card-text Цена: {{ item.price ? ( item.price | priceFormat ) : 'не указанна' }}
              p.card-text Продавец: {{ item.relationships.seller }}

      .col-3
        aside
          h4 Фильтры
          p По категории
          .btn-toolbar(role="toolbar" aria-label="Toolbar with button groups")
            select.custom-select
              option(selected="") недвижимость
              option(value="1") фотоаппараты
              option(value="2") автомобили
              option(value="3") ноутбуки

          p по цене
          .input-group
            label.custom-file-label(for="inputGroupFile03") с
            input.form-control(type="text" aria-label="First name")
            input.form-control(type="text" aria-label="Last name")
            label.custom-file-label(for="inputGroupFile03") до

          .input-group
            input(type="checkbox" aria-label="Checkbox for following text input")
            label Сначала избранные

          h4 Сортировать
          .btn-group-vertical.mr-2(role="group" aria-label="Second group")
            button.btn.btn-secondary(type="button") по рейтингу продавца
            button.btn.btn-secondary(type="button") по возрастанию цены
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      items: [],
      links: {
        products: 'http://avito.dump.academy/products',
        product: 'http://avito.dump.academy/products/:product_id',
        sellers: 'http://avito.dump.academy/sellers',
        seller: 'http://avito.dump.academy/sellers/:seller_id'
      },
      categories: [
        'immovable',
        'cameras',
        'auto',
        'laptops'
      ]
    }
  },
  mounted () {
    axios
      .get(this.links.products)
      .then(response => (this.items = response.data.data))
      .catch(error => console.error(error))
  },
  filters: {
    priceFormat (value) {
      let options = { style: 'currency', currency: 'RUB' }
      let numberFormat = new Intl.NumberFormat('ru-RU', options)
      return numberFormat.format(value)
    }
  }
}
</script>

<style lang="scss">

@import "./styles/custom-bootstrap";

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
}
</style>
