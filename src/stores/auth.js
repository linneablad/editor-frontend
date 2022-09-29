import { defineStore } from 'pinia'
import { useStore } from './index.js'

let baseUrl = "https://jsramverk-editor-liba19.azurewebsites.net";
// let baseUrl = "http://localhost:1337";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: "",
  }),
  actions: {
    getIsLoggedIn() {
      this.isLoggedIn = sessionStorage.getItem('isLoggedIn')
      return this.isLoggedIn
    },
    setIsLoggedIn(email) {
      this.isLoggedIn = email
      sessionStorage.setItem('isLoggedIn', email)
    },
    async login(email, password) {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
      console.log(response)
      const result = await response.json()
      if (response.status === 500 || response.status === 401) {
        console.log(result.errors)
        alert(result.errors.detail)
      } else {
        console.log(result)
        this.setIsLoggedIn(email)
      }
    },
    async register(email, password) {
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
      const result = await response.json()
      if (response.status === 500 || response.status === 401) {
        console.log(result.errors)
      } else {
        console.log(result)
        this.login(email, password)
      }
    },
    async logout() {
      const response = await fetch(`${baseUrl}/logout`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-type": "application/json",
        },
      })
      const result = await response.json()
        console.log(result)
        this.setIsLoggedIn("")
        const store = useStore()
        store.setEditDoc("")
    },
  },
})