import {ROUTES as WALLETS_ROUTES, ROUTES_NAMES as WALLETS_ROUTES_NAMES} from './wallets/WalletsRoutes'
import {ROUTES as ACCOUNT_ROUTES, ROUTES_NAMES as ACCOUNT_ROUTES_NAMES} from './account/AccountRoutes'

const ROUTES_NAMES = {
    HOME: 'HOME',
    WALLETS: WALLETS_ROUTES_NAMES,
    ACCOUNT: ACCOUNT_ROUTES_NAMES,
}

const ROUTES = [
    {
        path: '/dashboard',
        name: ROUTES_NAMES.HOME,
        component: () => import('@/views/after-auth/Home.vue'),
    },
    ...WALLETS_ROUTES,
    ...ACCOUNT_ROUTES,
]

export {
    ROUTES,
    ROUTES_NAMES
}