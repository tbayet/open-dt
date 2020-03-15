import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Profile from '../views/Profile'
import SignUp from '../views/SignUp'
import SignIn from '../views/SignIn'
import Middlewares from '../middlewares'
import store from '../store/index'

Vue.use(VueRouter)

const authenticated = { beforeEnter: Middlewares.auth.authenticated }
const notAuthenticated = { beforeEnter: Middlewares.auth.notAuthenticated }

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    ...authenticated,
  },
  {
    path: '/profile/:id',
    props: true,
    name: 'Profile',
    component: Profile,
    ...authenticated,
  },
  {
    path: '/sign-up',
    name: 'Sign up',
    component: SignUp,
    ...notAuthenticated,
  },
  {
    path: '/sign-in',
    name: 'Sign in',
    component: SignIn,
    ...notAuthenticated,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.ready) {
    await store.dispatch('init')
  }
  return next()
})

export default router
