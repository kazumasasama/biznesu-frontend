import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import axios from "axios";
import "@/css/custom-css-bootstrap-magic-2022-08-21.css"
import { data } from '@/i18n/index'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faLanguage, faArrowRotateRight, faBars, faLock, faArrowRightFromBracket, faRepeat} from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faLanguage, faArrowRotateRight, faBars, faLock, faArrowRightFromBracket, faRepeat)

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'ja',
  messages: data,
})

axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://frozen-wave-84233.herokuapp.com";

var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

createApp(App).use(router).use(createPinia()).use(i18n).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
