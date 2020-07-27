import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
Vue.prototype.$message = Message

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
