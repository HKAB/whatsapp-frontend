import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat'
import UserAuth from '@/components/UserAuth'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/chats/:uri?',
      name: 'Chat',
      component: Chat,
    },

    {
      path: '/auth',
      name: 'UserAuth',
      component: UserAuth,
    },

    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('authToken') !== null || to.path == '/auth') {
    next()
  }
  else {
    next('/auth')
  }
}) // The beforeEach guard is called before a navigating to any route in our application.

export default router

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
