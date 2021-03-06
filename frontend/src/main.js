import Vue from 'vue'
import '@/filters/GlobalFilters'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/i18n';
import Axios from 'axios'
import Vuex from 'vuex'
import { responseSuccess, responseError, requestAuthenticate } from '@/repositories/ApiInterceptors'


import AppLayout from './components/layouts/AppLayout.vue'
import DefaultLayout from './components/layouts/DefaultLayout.vue'
import GuestAppLayout from './components/layouts/GuestAppLayout.vue'

Vue.component('AppLayout', AppLayout)
Vue.component('DefaultLayout', DefaultLayout)
Vue.component('GuestAppLayout', GuestAppLayout)

import store from '@/store'

Vue.prototype.$http = Axios;


// https://axios-http.com/docs/interceptors
Vue.prototype.$http.interceptors.response.use(responseSuccess, responseError)

Vue.prototype.$http.interceptors.request.use(requestAuthenticate)


Vue.config.productionTip = false

Vue.use(Vuex)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
