<script>
import { useAuthStore } from "../../stores/auth"

export default {
  setup() {
    const authStore = useAuthStore()
    return {
      authStore,
    }
  },
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    async login() {
      if (this.email && this.password) {
        this.authStore.login(this.email, this.password)
      }
      else {
        alert("Please provide both email and password")
      }
    },
  },
}
</script>

<template>
  <div class="block">
    <h1 class="title">Login</h1>

    <label class="label">Email</label>
    <input class="input" v-model="email" />
    <label class="label">Password</label>
    <input class="input" type="password" v-model="password" />

    <button class="button is-success" @click="login">Login</button>
  </div>
</template>
