// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
/* eslint-disable no-unused-vars */
import element from '@/utils/element'

const EOS = require('eosjs')

Vue.config.productionTip = false
Vue.prototype.$eosjs = EOS
Vue.prototype.$dayjs = dayjs

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
