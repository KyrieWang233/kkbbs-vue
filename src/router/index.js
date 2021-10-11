import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Profile from '../views/Profile.vue'
import Myquestion from "../views/profile/Myquestion";
import Message from "../views/profile/Message";
import Publish from '../views/Publish.vue'
import Question from '../views/Question.vue'
import Error from "../views/Error";
import PageNot from "../views/PageNotFound";
import Github from "../views/Github";
import Register from "../views/Register";
import supplierAllBack from "@/views/supplierAllBack";
import Information from "@/views/profile/UserInformation";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect:{name:'QuestionList'}
  },
  {
    path: '/index',
    name: 'QuestionList',
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile/myquestion',
    name: 'Myquestion',
    meta: {
      requireAuth: true
    },
    component: Myquestion
  },
  {
    path: '/profile/message',
    name: 'Message',
    meta: {
      requireAuth: true
    },
    component: Message
  },
  {
    path: '/profile/information',
    name: 'Information',
    meta: {
      requireAuth: true
    },
    component: Information
  },
  {
    path: '/publish/add',
    name: 'Publish',
    meta: {
      requireAuth: true
    },
    component: Publish
  },
  {
    path: '/publish/:questionId',
    name: 'Publish',
    meta: {
      requireAuth: true
    },
    component: Publish
  },
  {
    path: '/question/:questionId',
    name: 'Question',
    component: Question
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  },
  {
    path: '/callback',
    name: 'Github',
    component: Github
  },
  {
    path: '/supplierAllBack',
    name: supplierAllBack,
    component: supplierAllBack
  },
  {
    path: '/*',
    name: 'PageNotFound',
    component: PageNot
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//解决导航栏重复点击路由错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
