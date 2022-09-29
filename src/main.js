import { createApp } from "vue";
import App from "./App.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App);

app.use(pinia)
app.use(CKEditor);
app.mount("#app");
