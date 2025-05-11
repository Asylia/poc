const ROUTES_NAMES = {
    'LOGIN': 'AUTH_LOGIN',
    'VERIFY_EMAIL': 'AUTH_VERIFY_EMAIL',
}

const ROUTES = [
    {
        children: [
            {
                path: '/login',
                name: ROUTES_NAMES.LOGIN,
                component: () => import('@/views/auth/Login.vue')
            },
            {
                path: '/verify-email',
                name: ROUTES_NAMES.VERIFY_EMAIL,
                component: () => import('@/views/auth/VerifyEmail.vue')
            }
        ]
    }
]

export {
    ROUTES,
    ROUTES_NAMES
}