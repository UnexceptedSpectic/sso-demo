<template>
  <div id="auth">
    <button :disabled="loggedIn" class="login" v-on:click="login">Login</button>
    <button :disabled="!loggedIn" class="logout" v-on:click="logout">Logout</button>
    <ul class="workerLog" v-if="loggedIn">
      <li v-for="line in log">{{line}}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
let ssoWebApp = 'http://auth.libredelibre.com';
let ssoApi = 'http://auth.libredelibre.com:8080';
let ssoSuiteId = '5fe3b479216ca802f957456c';
let thisDomain = 'http://demo.libredelibre.com';

export default {
  name: 'app',
  data () {
    return {
      log: ['Below is a log of requests made to the SSO api and the interpreted login status:'],
      loggedIn: undefined,
      jwt: undefined
    }
  },
  created () {
    // Check query param for jwt. Will be present after login redirect
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('jwt')) {
      localStorage.setItem('jwt', urlParams.get('jwt'));
      this.jwt = localStorage.getItem('jwt');
      this.$router.push('/');
    } else if (urlParams.has('jwts')) {
      let userJwts = JSON.parse(urlParams.get('jwts'));
      localStorage.setItem('jwt', userJwts[userJwts.length - 1]);
      this.jwt = localStorage.getItem('jwt');
      this.$router.push('/');
    }
    if (this.isLoggedIn()) {
      this.loggedIn = true;
      this.startLog(this);
    } else {
      this.loggedIn = false;
    }
  },
  methods: {
    login () {
      window.location.href = ssoWebApp + '/login?ssoSuiteId=' + ssoSuiteId + '&redirectUrl=' + thisDomain;
    },
    logout() {
      let jwt = this.jwt;
      localStorage.removeItem('jwt');
      window.location.href = ssoWebApp + '/logout?redirectUrl=' + thisDomain + '/&jwt=' + jwt;
    },
    startLog: async (app) => {
      while (app.isLoggedIn()) {
        if (await app.jwtIsValid(app)) {
          app.log.push(new Date().toString() + ': still logged in');
          await new Promise(r => setTimeout(r, 2000));
        } else {
          localStorage.removeItem('jwt');
          app.jwt = undefined;
          break;
        }
      }
    },
    jwtIsValid: async (app) => {

      try {
        await axios.post(ssoApi + '/account/authenticate', {'jwt': app.jwt})
        return true;
      } catch (err) {
        app.loggedIn = false;
        if (err.response.status == 401) {
          return false;
        } else {
          console.error(err);
          throw error;
        }
      }

    },
    isLoggedIn() {
      if (this.jwt != undefined) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style>
  .workerLog {
    list-style-type: none;
  }
</style>

