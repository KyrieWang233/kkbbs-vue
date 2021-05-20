import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import axios from 'axios'
import "./axios"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'; //导入时间模块
import './permission' // 路由拦截

// use

Vue.use(mavonEditor)

Vue.prototype.$axios = axios

Vue.use(Element)
Vue.config.productionTip = false

moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment;//赋值使用

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')