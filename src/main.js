import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import vuetify from './plugins/vuetify';

import axios from "./wrappers/axios";
import storage from "./wrappers/storage";
//import appConfig from "./appConfig.js";

import './assets/css/global.css';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$ls = storage;
//Vue.prototype.$appConfig = appConfig;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');