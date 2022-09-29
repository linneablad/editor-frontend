<script>
  import { useStore } from "../stores/index"
  import { useAuthStore } from "../stores/auth"
  import Editor from "./Editor.vue"
  
  export default {
    components: {
      Editor,
    },
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
        editDoc: '',
      }
    },
    mounted() {
      this.store.fetchDocs()
    },
    watch: { 
      'store.editDoc': {
        handler() {
          this.editDoc = this.store.getEditDoc()
        },
      immediate: true,
      },
    },
    methods: {
      async newDoc() {
        const _id = await this.store.newDoc()
        this.store.setEditDoc(_id)
      },
      async showAll() {
        this.store.setEditDoc('')
        await this.store.fetchDocs()
      },
    },
  }
  </script>
  
  <template>
    <div>
      <div class="block" v-if="editDoc === null || editDoc.length === 0">
          <h1>All documents</h1>
          <button class="button is-primary" @click="newDoc()">
            New Document
          </button>
          <table class="table">
            <tr>
              <th>Document name</th>
              <th>Owner</th>
              <th>Options</th>
            </tr>
            <tr
              v-for="(document, index) in store.documents"
              v-bind:key="index"
            >
              <td>{{ document.name }}</td>
              <td v-if="document.owner === authStore.isLoggedIn">Me</td>
              <td v-else>{{document.owner}}</td>
              <td>
                <button @click="store.setEditDoc(document._id)" class="button is-link edit">
                  Edit
                </button>
                <button v-if="document.owner === authStore.isLoggedIn"
                  @click="store.deleteDoc(document._id)"
                  class="button is-danger delete"
                ></button>
              </td>
            </tr>
          </table>
        </div>
      <div v-else>
        <button @click="showAll()" class="button is-link">
          Show all documents
        </button>
        <Editor :docId="editDoc" />
      </div>
    </div>
  </template>
  