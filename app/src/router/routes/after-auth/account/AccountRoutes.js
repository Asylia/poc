const ROUTES_NAMES = {
    GENERAL: 'ACCOUNT_GENERAL',
}

const ROUTES = [
    {
        path: '/account',
        name: ROUTES_NAMES.GENERAL,
        component: () => import('@/components/views/account/security/Index.vue'),
    }
]

export {
    ROUTES,
    ROUTES_NAMES
}