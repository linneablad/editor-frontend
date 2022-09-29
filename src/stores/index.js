import { defineStore } from 'pinia'

let baseUrl = "https://jsramverk-editor-liba19.azurewebsites.net";
// let baseUrl = "http://localhost:1337";

export const useStore = defineStore("main", {
  state: () => ({
    documents: [],
    editDoc: ""
  }),
  actions: {
    getEditDoc() {
      this.editDoc = sessionStorage.getItem('editDoc')
      return this.editDoc
    },
    setEditDoc(docId) {
      this.editDoc = docId
      sessionStorage.setItem('editDoc', docId)
    },
    async fetchDocs() {
      const response = await fetch(`${baseUrl}/`, {
        credentials: 'include'
      })
      const result = await response.json()
      console.log(result)
      this.documents = result.data.documents
    },
    getDoc(docId) {
      let doc = {}

      this.documents.map((object) => {
        if (object._id == docId) {
          doc = object
        }
      })
      return doc
    },
    async newDoc() {
      const response = await fetch(`${baseUrl}/`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
          name: "New Document",
          content: "",
          allowedUsers: []
        }),
        headers: {
          "Content-type": "application/json",
        }
      })
      const result = await response.json()
      if (response.status === 500) {
        console.log(result.errors)
      }
      else {
        await this.fetchDocs()
        return result.data._id
      }
    },
    async deleteDoc(docId) {
      const response = await fetch(`${baseUrl}/`, {
        method: "DELETE",
        credentials: 'include',
        body: JSON.stringify({
          _id: docId
        }),
        headers: {
          "Content-type": "application/json",
        }
      })
      if (response.status === 500) {
        const result = await response.json()
        console.log(result.errors)
      }
      await this.fetchDocs()
    },
    async allowUser(document, email) {
      const response = await fetch(`${baseUrl}/allow`, {
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify({
          _id: document._id,
          email: email
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
  },
})