// vue
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// plugins
import installPluginsToTheApp from './utils/plugins/_Install'
import installGlobalComponents from './utils/GlobalComponents'

// styles
import './assets/main.scss'

// preline UI
import "preline/preline";

// create instance of vue app
const app = createApp(App)
app.use(router)

installPluginsToTheApp(app)
installGlobalComponents(app)

router.isReady().then(() => app.mount('#app'))