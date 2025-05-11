// router
import {createRouter, createWebHistory} from 'vue-router'
import Routes from "./routes"
import RouterGuard from "./routerGuard";
import {nextTick} from "vue";

const AppRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: Routes
})

AppRouter.beforeEach(async (to, from, next) => await RouterGuard(to, from, next))

AppRouter.afterEach((to, from, failure) => {
    if (failure) {
        console.error('failure', failure)
        return
    }
    setTimeout(() => {
        window.HSStaticMethods.autoInit();
    }, 100)
})

export default AppRouter
