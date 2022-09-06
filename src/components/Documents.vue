<script>
import Editor from './Editor.vue'

let baseUrl = window.location.href.includes("localhost") ?
        "http://localhost:1337" :
        "https://jsramverk-editor-liba19.azurewebsites.net"

export default {
  components: {
    Editor,
  },
  data() {
    return {
      documents: [],
      editDoc: {},
    };
  },
  mounted() {
    this.fetchDocs()
  },
   methods: {
    async fetchDocs() {
      let that = this
      const response = await fetch(`${baseUrl}`)
      const result = await response.json()
      that.documents = result.data
    },
    async newDoc() {
      let that = this
      const response = await fetch(`${baseUrl}`, {
        method: "POST",
        body: JSON.stringify({
          name: "New Document",
          content: ""
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
      const result = await response.json()
      if (response.status === 500) {
        console.log(result.errors)
      }
      else {
        that.editDoc.name = "New Document"
        that.editDoc.content = ""
        that.editDoc._id = result.data._id
        await this.fetchDocs()
      }
    },
    async deleteDoc(document) {
      const response = await fetch(`${baseUrl}`, {
        method: "DELETE",
        body: JSON.stringify({
          _id: document._id
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
      if (response.status === 500) {
        const result = await response.json()
        console.log(result.errors)
      }
      await this.fetchDocs()
    },
    async showAll() {
      this.editDoc = {}
      await this.fetchDocs()
    }
  },
}
</script>

<template>
  <div>
    <div class="block" v-if="Object.keys(editDoc).length === 0">
    <h1>All documents</h1>
    <button class="button is-primary" @click="newDoc()">New Document</button>
    <table class="table">
      <tr>
        <th>Document name</th>
        <th>Options</th>
      </tr>
      <tr v-for="(document, index) in documents" v-bind:key="index">
        <td>{{ document.name }}</td>
        <td>
          <button @click="editDoc=document" class="button is-link">Edit</button>
          <button @click="deleteDoc(document)" class="button is-danger">Delete</button>
        </td>
      </tr>
    </table>
    </div>
    <div v-else>
      <Editor :document="editDoc"/>
      <button @click="showAll()" class="button is-link">Show all documents</button>
    </div>
  </div>
</template>
