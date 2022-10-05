import { defineStore } from 'pinia'

let baseUrl = "https://jsramverk-editor-liba19.azurewebsites.net";
//let baseUrl = "http://localhost:1337";

export const useStore = defineStore("main", {
  state: () => ({
    documents: [],
    editDoc: {}
  }),
  actions: {
    getEditDoc() {
      this.editDoc = JSON.parse(sessionStorage.getItem('editDoc'))
      return this.editDoc
    },
    setEditDoc(document) {
      this.editDoc = document
      sessionStorage.setItem('editDoc', JSON.stringify(document))
    },
    async fetchDocs() {
      const response = await fetch(`${baseUrl}/graphql`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `{
            documents {
              _id,
              name,
              owner
            }
          }`
        })
      })
      const result = await response.json()
      console.log(result.data.documents)
      this.documents = result.data.documents
    },
    async fetchDoc(docId) {
      const response = await fetch(`${baseUrl}/graphql`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `{
            document(docId: "${docId}") {
              _id,
              name,
              owner,
              content,
              allowedUsers {
                email
              }
            }
          }`
        })
      })
      const result = await response.json()
      if (response.status !== 200) {
        console.log(result.errors)
      }
      else {
        console.log(result.data)
        this.setEditDoc(result.data.document)
      }
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