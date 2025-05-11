import {ROUTES_NAMES as AUTH_ROUTES_NAMES} from './routes/Auth'
import {ROUTES_NAMES} from './routes/after-auth/AfterAuth'

const ROUTE_NAMES = {
    ROOT: 'ROOT',
    AUTH: AUTH_ROUTES_NAMES,
    ...ROUTES_NAMES,
    404: 'VIEW_404',
}

export default ROUTE_NAMES
