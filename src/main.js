// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
/* eslint-disable no-unused-vars */
import element from '@/utils/element'
import i18n from '@/utils/i18n'

const EOS = require('eosjs')

Vue.config.productionTip = false
Vue.prototype.$eosjs = EOS
Vue.prototype.$dayjs = dayjs

function getLocalLang () {
  if (localStorage) {
    let lang = localStorage.getItem('lang')
    if (lang) {
      store.dispatch('setLang', lang)
    }
    return false
  }
  if (window.navigator) {
    if (navigator.language === 'en') {
      store.dispatch('setLang', 'en')
    } else {
      store.dispatch('setLang', 'zh')
    }
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  mounted () {
    getLocalLang()
  },
  watch: {
    '$store.state.lang' (newVal, oldVal) {
      this.$i18n.locale = newVal
    }
  }
})
