import Vue from 'vue'
import App from './App.vue'

import starpanel from './starpanel.vue'
Vue.component('star-panel', starpanel)

import imagecard from './imagecard.vue'
Vue.component('image-card', imagecard)

import modal from './modal.vue'
Vue.component('modal', modal)


import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

new Vue({
  el: '#app',
  render: h => h(App)
})