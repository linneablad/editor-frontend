<script>
  import { useStore } from "../stores/index"
  import { useAuthStore } from "../stores/auth"
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
  import { io } from "socket.io-client"
  
  let socket
  let baseUrl = "https://jsramverk-editor-liba19.azurewebsites.net";
  //let baseUrl = "http://localhost:1337";
  
  export default {
    props: ["docId"],
    setup() {
    const store = useStore()
    const authStore = useAuthStore()
    return {
      store,
      authStore
    }
  },
    data() {
      return {
        document: {},
        editor: ClassicEditor,
        editorConfig: {
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "numberedList",
            "bulletedList",
            "|",
            "undo",
            "redo",
          ],
        },
      }
    },
    created() {
      this.connect()
    },
    beforeUnmount() {
      this.disconnect()
    },
    watch: {
      "store.documents": {
        handler() {
          this.document = this.store.getDoc(this.docId)
        },
        immediate: true,
      },
    },
    methods: {
      connect() {
        socket = io(baseUrl)
  
        socket.emit("create", this.document._id)
  
        socket.on("editDoc", (document) => {
          this.document.content = document.content
          this.document.name = document.name
        })
      },
      disconnect() {
        socket.disconnect()
      },
      update() {
        socket.emit("editDoc", this.document)
      },
      allowUser() {
        let userEmail = prompt("Enter the users email:")
  
        if (userEmail !== null) {
          this.store.allowUser(this.document, userEmail)
        }
      },
    },
  }
  </script>
  
  <template>
    <div class="block">
      <h2 v-if="document.owner !== authStore.isLoggedIn">
        Owner: {{ document.owner }}
      </h2>
      <input class="input is-size-3" v-model="document.name" @change="update()" />
      <ckeditor
        :editor="editor"
        v-model="document.content"
        :config="editorConfig"
        @input="update()"
      ></ckeditor>
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