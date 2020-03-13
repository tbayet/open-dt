import Vue from 'vue'
import App from './App'
import store from './store'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import router from './router'

Vue.config.productionTip = false

new Vue({
  apolloProvider: createProvider(),
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app')
