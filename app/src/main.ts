import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './app.css'
import 'element-plus/dist/index.css'
import 'viewerjs/dist/viewer.css'

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
