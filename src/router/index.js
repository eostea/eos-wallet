import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index'
import store from '@/store'
import {Message} from 'element-ui'
const features = () => import('@/view/features')
const Wallet = () => import('@/view/wallet/index')
const Account = () => import('@/view/account')
const CreateKeys = () => import('@/view/createKeys')
const ImportKey = () => import('@/view/importKey')
const Producers = () => import('@/view/producers')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          name: 'features',
          path: 'features',
          component: features,
          alias: '/'
        },
        {
          name: 'createkeys',
          path: 'createkeys',
          component: CreateKeys
        },
        {
          name: 'wallet',
          path: 'wallet',
          component: Wallet,
          meta: {
            requiresAuth: true,
            needConnectNet: true
          }
        },
        {
          name: 'account',
          path: 'account',
          component: Account,
          meta: {
            needConnectNet: true
          }
        },
        {
          name: 'importkeys',
          path: 'importkeys',
          component: ImportKey,
          meta: {
            needConnectNet: true
          }
        },
        {
          name: 'producers',
          path: 'producers',
          component: Producers,
          meta: {
            requiresAuth: true,
            needConnectNet: true
          }
        },
        {
          name: 'test',
          path: 'test',
          component: () => import('@/view/test'),
          meta: {
            // requiresAuth: true,
            needConnectNet: true
          }
        },
        {
          name: 'setting',
          path: 'setting',
          component: () => import('@/view/setting')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.eosConfig && to.matched.some(record => record.meta.needConnectNet)) {
    Message.warning('此选项需要先进行网络设置！')
    next({
      path: '/setting',
      query: { redirect: to.fullPath }
    })
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.state.isOnline) {
        Message.warning('此选项需要先导入密匙！')
        next({
          path: '/importkeys',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
})

export default router
