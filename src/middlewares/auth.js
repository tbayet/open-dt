import store from '../store/index'

export default {
  authenticated: (to, from, next) => {
    if (!store.state.account.isAuthenticated) {
      return next('/sign-in')
    }
    if (!['USER', 'ADMIN'].includes(store.state.account.role)) {
      return next('/sign-up')
    }
    return next()
  },

  notAuthenticated: (to, from, next) => {
    if (store.state.account.isAuthenticated) {
      if (['USER', 'ADMIN'].includes(store.state.account.role)) {
        return next('/')
      }
      if (to.path !== '/sign-up') {
        return next('/sign-up')
      }
    }
    return next()
  },
}
