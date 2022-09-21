<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { io } from 'socket.io-client';

// let baseUrl = window.location.href.includes("localhost") ?
//       "http://localhost:1337" :
//       "https://jsramverk-editor-liba19.azurewebsites.net"
let baseUrl = "https://jsramverk-editor-liba19.azurewebsites.net";
let socket;

export default {
  props: ["document"],
  data() {
    return {
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
    };
  },
  created() {
    this.connect()
  },
  beforeUnmount() {
    this.disconnect();
  },
  methods: {
    connect() {
      socket = io(baseUrl)
      
      socket.emit("create", this.document._id)
      
      socket.on("editDoc", (document) => {
        this.document.content = document.content
        this.document.name = document.name
      });
    },
    disconnect() {
      socket.disconnect()
    },
    async save() {
      socket.emit("editDoc", this.document);
    },
  }
};
</script>

<template>
  <div class="block">
    <input class="input is-size-3" v-model="document.name" @change="save()" />
    <ckeditor
      :editor="editor"
      v-model="document.content"
      :config="editorConfig"
      @input="save()"
    ></ckeditor>
  </div>
</template>

<style scoped>
.input.is-size-3 {
  padding: 10px;
}
</style>
