// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import './assets/stylus/main.styl'
import VeeValidate from 'vee-validate';


// Vue.config.productionTip = false
Vue.use(Vuetify, {
  theme: {
    primary: '#616161'
  }
})
Vue.use(VeeValidate)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
