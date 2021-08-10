import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/pages/LoginPage.vue'),
        meta: {
            layout: 'DefaultLayout',
            guest: true,
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/components/pages/RegisterPage.vue'),
        meta: {
            layout: 'DefaultLayout',
        }
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/pages/HomePage.vue'),
        meta: {
            layout: 'AppLayout',
            requiresAuth: true,
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/components/pages/AboutPage.vue'),
        meta: {
            layout: 'AppLayout',
        }
    },
    {
        path: '/modules/setup',
        name: 'module-setup',
        component: () => import('@/components/pages/ModuleSetupPage.vue')
    },
//     {
//         path: '/modules/data/:module_technical_name/:id',
//         name: 'module-data-edit',
//         props: true,
//         component: () => import('@/components/pages/ModuleDataEditPage.vue')
//     },
    {
        path: '/views/setup',
        name: 'view-setup',
        component: () => import('@/components/pages/ModuleSetupPage.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters['user/isConnected']) {
        next()
      } else {
        next({
          name: 'login',
          params: { nextUrl: to.fullPath }
        })
      }
    } else if(to.matched.some(record => record.meta.guest)) {
      if(store.getters['user/isConnected']){
        next({ name: 'home'})
      }
      else{
        next()
      }
    } else {
      next()
    }
  })

export default router
