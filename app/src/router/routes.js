// all routes names
import ROUTE_NAMES from "./RouteNames"
// single routes
import {ROUTES as AUTH_ROUTES} from './routes/Auth'
import {ROUTES} from './routes/after-auth/AfterAuth'

const routes = [
    {
        path: '/',
        name: ROUTE_NAMES.ROOT,
        redirect: () => ({name: ROUTE_NAMES.HOME})
    },
    ...AUTH_ROUTES,
    {
        path: '/',
        redirect: () => ({name: ROUTE_NAMES.HOME}),
        component: () => import('@/templates/AfterAuth.vue'),
        children: [
            ...ROUTES,
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: ROUTE_NAMES["404"],
        component: () => import('@/views/status/global/404.vue')
    }
]

export default routes