<script>
import Login from './Login.vue'
import Register from './Register.vue'

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      register: false,
    };
  },
}
</script>

<template>
  <div class="block">
    <div v-if="!register">
      <Login/>
      <button class="button" @click="register=true">Register</button>
    </div>
    <div v-else>
      <Register/>
      <button class="button" @click="register=false">Login instead</button>
    </div>
  </div>
</template>
