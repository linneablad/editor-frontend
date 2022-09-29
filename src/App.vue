<script>
import { useAuthStore } from "./stores/auth";
import Documents from './components/Documents.vue';
import Auth from './components/auth/Auth.vue';

export default {
  components: {
    Documents,
    Auth
  },
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    };
  },
  data() {
    return {
      isLoggedIn: ""
    }
  },
   watch: { 
    'authStore.isLoggedIn': {
      handler() {
        this.isLoggedIn = this.authStore.getIsLoggedIn()
      },
    immediate: true,
		},
   }
};
</script>
<template>
  <main class="container section">
    <header></header>
    <div v-if="isLoggedIn !== null && isLoggedIn.length > 0">
      <div class="has-text-right">
        <button class="button" @click="authStore.logout">Logout</button>
      </div>
      <Documents />
    </div>
    <div v-else>
      <Auth />
    </div>
  </main>
</template>

<style>
h1 {
  font-size: 3rem;
}
h2 {
  font-size: 2.5rem;
}
h3 {
  font-size: 2rem;
}
h4 {
  font-size: 1.5rem;
}
</style>
