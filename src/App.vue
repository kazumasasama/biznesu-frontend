<template>
<div id="app">
  <div class="vld-parent">
    <loading v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page=true
      color="rgb(140, 146, 232)"
      loader="dots"
      :height=100
      :width=150
      :opacity=1
    >
      <template v-slot:after>
        <p class="spinner-after">{{ systemStore.LoadingMessage }}</p>
      </template>
    </loading>

    <HeaderNav
      @getMessage="getMessage"
    />

    <div class="alert alert-info" role="alert" v-if="message">
      {{ message }}
    </div>

    <router-view/>

  </div>
</div>

</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import HeaderNav from '@/components/HeaderNav.vue'
import axios from 'axios'
import * as moment from 'moment-timezone'

export default {
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    return {
      systemStore,
      userStore,
    }
  },
  components: {
    Loading,
    HeaderNav,
  },
  created() {
    this.autoLogin();
    this.systemStore.initBusiness();
    this.systemStore.initBusinessTimes();
    this.systemStore.initCategories();
    this.systemStore.initConfig();
    this.systemStore.initMenus();
    this.userStore.initStatuses();
  },
  computed: {
    ...mapWritableState(useSystemStore, ['isLoading']),
    ...mapWritableState(useUserStore, ['isLoggedin']),
    ...mapWritableState(useUserStore, ['isAdmin']),
  },
  data() {
    return {
      error: null,
      message: null,
    }
  },
  methods: {
    autoLogin() {
      const lastLogin = moment.utc(localStorage.getItem('last_login'))
      const expire = lastLogin.clone().add(1, 'day')
      const now = moment.utc()
      if (expire < now) {
        localStorage.removeItem('user_id')
        localStorage.removeItem('jwt')
        localStorage.removeItem('last_login')
        return
      }
      if (!this.isLoggedin && localStorage.jwt) {
        const userId = localStorage.getItem('user_id')
        axios.get(`/users/${userId}.json`)
        .then((res)=> {
          const user = res.data;
          this.userStore.switchLoggedin(true)
          this.userStore.pushUser(user);
          this.isAdmin = user.admin;
        })
        .catch((error)=> {
          this.error = error.response;
        })
      }
    },
    getMessage(message) {
      this.message = message
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(44, 62, 80);
  background-color: rgb(246, 243, 255);
}

html {
  background-color: rgb(246, 243, 255);
}

.navbar-white {
  background-color: white;
}

nav a {
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}

input {
  width: 100%;
}
textarea {
  width: 100%;
}
ul {
    list-style: none;
  }
hr {
  border-top: 1px;
}

.container {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 25px;
  margin-bottom: 25px;
}

.btn-container * {
  margin: 5px 8px;
}


#bisiness-name-logo {
  /* font-family: Helvetica;
  font-weight: bold;
  color: white;
  font-size: 20pt;
  margin-bottom: 0px; */
  max-width: 150px;
}

.spinner-after {
  color: rgb(140, 146, 232);
  font-size: larger;
  font-weight: 600;
}
/* .dropdown-menu-dark .admin-dropdown-item {
  color: rgb(44, 62, 80);
} */
</style>
