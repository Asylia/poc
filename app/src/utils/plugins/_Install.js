// import all plugins
import pinia from './Pinia.js'
import FontAwesome from "./FontAwesome"
import InstallSupabase from "./Supabase"
import Debugger from "@/utils/plugins/Debugger";
import Hotjar from './Hotjar'
// install all plugins
export default async app => {
    app.use(pinia)
    FontAwesome(app)
    InstallSupabase(app)
    Debugger(app)
    Hotjar(app)

    window.APP_VERSION_CODE = `${import.meta.env.VITE_APP_VERSION}.${import.meta.env.VITE_APP_SUB_VERSION}`
    DEBUGGER.log(`${import.meta.env.VITE_APP_APP_NAME} app version ${window.APP_VERSION_CODE} is running.`)
}
