import { defineStore } from 'pinia'
import { io } from "socket.io-client";

let socket;

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
              code,
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
          code: false,
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
        return result.data
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
      await this.fetchDoc(document._id)
    },
    socketConnect(document) {
      socket = io(`${baseUrl}`);

      socket.emit("create", document._id);

      socket.on("editDoc", (document) => {
        this.setEditDoc(document)
      });
    },
    socketDisconnect() {
      socket.disconnect();
    },
    socketUpdate(document) {
      socket.emit("editDoc", document);
    },
    async runCode(code) {
      const data = {
        code: window.btoa(code)
      }
      const response = await fetch("https://execjs.emilfolino.se/code", {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
    const result = await response.json()
    const decodedOutput = window.atob(result.data);
    return decodedOutput;
    }
  },
})