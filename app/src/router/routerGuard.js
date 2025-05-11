import {useUserStore} from '@/stores/UserStore'
import {Supabase} from "@/utils/plugins/Supabase"
import ROUTE_NAMES from "@/router/RouteNames"

const AUTH_PREFIX = 'AUTH'

const routerGuard = (async (to, from, next) => {
    const redirectToView = async name => to.name !== name ? await next({name}) : await next()

    const userStore = useUserStore()
    const {data: {session}, error} = await Supabase.auth.getSession()

    if (error) {
        return alert('error')
    }

    const isLoggedIn = !!session?.user
    const isGoingToAuthArea = to?.name?.includes(AUTH_PREFIX)
    const isGoingToProtectedArea = !isGoingToAuthArea

    if (isLoggedIn) {
        if (!userStore.hasUser) {
            await userStore.setUser(session.user)
            await userStore.loadUserProfile()
        }
        // if (!emailConfirmed) return await redirectToView(ROUTE_NAMES.AUTH.VERIFY_EMAIL)
        if (isGoingToAuthArea) return await redirectToView(ROUTE_NAMES.ROOT)
    }

    if (!isLoggedIn) {
        if (isGoingToProtectedArea) {
            // if (isGoingToProtectedArea || to.name === ROUTE_NAMES.AUTH.VERIFY_EMAIL) {
            return await redirectToView(ROUTE_NAMES.AUTH.LOGIN)
        }
        if (isGoingToAuthArea && to.name !== ROUTE_NAMES.AUTH.VERIFY_EMAIL) {
            return await redirectToView(ROUTE_NAMES.AUTH.LOGIN)
        }
    }

    return await next()

})

export default routerGuard
