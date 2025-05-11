const ROUTES_NAMES = {
    LIST: 'WALLETS_LIST',
    VIEW_WALLET: 'VIEW_WALLET',
}

const ROUTES = [
    // view single wallet
    {
        path: '/wallet/:id',
        name: ROUTES_NAMES.VIEW_WALLET,
        component: () => import('@/views/after-auth/Wallet.vue'),
    },
]

export {
    ROUTES,
    ROUTES_NAMES
}