import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'element-plus/dist/index.css'
import './app.css'

const app = createApp(App)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
