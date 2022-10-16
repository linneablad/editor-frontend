<script>
import { useStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import Texteditor from "./Texteditor.vue";
import CodeEditor from "./CodeEditor.vue";

export default {
  props: ["doc"],
  components: {
    Texteditor,
    CodeEditor,
  },
  setup() {
    const store = useStore();
    const authStore = useAuthStore();
    return {
      store,
      authStore,
    };
  },
  data() {
    let bool = this.doc.code
    return {
      code: bool,
      document: this.doc
    };
  },
  created() {
    this.store.socketConnect(this.document);
  },
  beforeUnmount() {
    this.store.socketDisconnect();
  },
    watch: { 
    'store.editDoc': {
      handler() {
        this.document = this.store.editDoc;
      },
		},
  },
  methods: {
    setCode(bool) {
      this.code = bool
      this.document.code = bool
    },
    update() {
      this.store.socketUpdate(this.document)
      this.store.setEditDoc(this.document);
    },
    allowUser() {
      let userEmail = prompt("Enter the users email:");

      if (userEmail !== null) {
        this.store.allowUser(this.document, userEmail);
      }
    },
  }
};
</script>

<template>
  <div class="block">
    <h2 v-if="document.owner !== authStore.isLoggedIn">
      Owner: {{ document.owner }}
    </h2>
    <input class="input is-size-3" v-model="document.name" @change="update()" />
    <div v-if="!code">
      <Texteditor :document="store.editDoc" />
      <button class="button" @click="setCode(true)">Switch to code-editor</button>
    </div>
    <div v-else>
      <CodeEditor :document="store.editDoc" />
      <button class="button" @click="setCode(false)">Switch to texteditor</button>
    </div>
    <div v-if="document.allowedUsers">
      <h3>Allowed users:</h3>
      <div v-for="(user, index) in document.allowedUsers" v-bind:key="index">
        <p>
          {{ user.email }}
        </p>
      </div>
      <button class="button is-success" @click="allowUser()">Add user</button>
    </div>
  </div>
</template>

<style scoped>
  .input.is-size-3 {
    padding: 10px;
  }
</style>