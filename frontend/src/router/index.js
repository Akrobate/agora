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
            public: true,
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
        path: '/guest-home',
        name: 'guest-access',
        component: () => import('@/components/pages/GuestAccessPage.vue'),
        meta: {
            layout: 'AppLayout',
            requiresAuth: true,
        }
    },
    {
        path: '/campaigns/create',
        name: 'campaign-create',
        props: true,
        component: () => import('@/components/pages/CampaignCreatePage.vue'),
        meta: {
            layout: 'AppLayout',
            requiresAuth: true,
        }
    },
    {
        path: '/campaigns/edit/:id',
        name: 'campaign-edit',
        props: (route) => ({
            ...route.params,
            id: parseInt(route.params.id),
        }),
        component: () => import('@/components/pages/CampaignCreatePage.vue')
    },
    {
        path: '/campaigns/elo-game/:campaign_id',
        name: 'campaign-elo-game',
        props: (route) => ({
            ...route.params,
            campaign_id: parseInt(route.params.campaign_id)
        }),
        component: () => import('@/components/pages/EloGamePage.vue')
    },
    {
        path: '/campaigns/:campaign_id/results',
        name: 'campaign-result',
        props: (route) => ({
            ...route.params,
            campaign_id: parseInt(route.params.campaign_id)
        }),
        component: () => import('@/components/pages/CampaignResultPage.vue')
    },
    {
        path: '/campaigns/:campaign_id/participate',
        name: 'campaign-participate',
        props: (route) => ({
            ...route.params,
            campaign_id: parseInt(route.params.campaign_id)
        }),
        component: () => import('@/components/pages/CampaignParticipationMainPage.vue')
    },
    {
        path: '/campaigns/:campaign_status',
        name: 'campaign-list',
        props: true,
        component: () => import('@/components/pages/CampaignListPage.vue'),
        meta: {
            layout: 'AppLayout',
            requiresAuth: true,
        }
    },
    {
        path: '/user/profile',
        name: 'user-profile',
        props: true,
        component: () => import('@/components/pages/UserProfilePage.vue'),
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
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['authentication_store/isConnected']) {
            next()
        } else {
            next({
                name: 'login',
                params: { nextUrl: to.fullPath }
            })
        }
    }
    next()
})

export default router
