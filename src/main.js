import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Auth from './Auth.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Auth}
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
