<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  
  let baseUrl = window.location.href.includes("localhost") ?
        "http://localhost:1337" :
        "https://jsramverk-editor-liba19.azurewebsites.net"


  export default {
    props: ['document'],
    data() {
      return {
        editor: ClassicEditor,
        editorConfig: {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'undo', 'redo',],
        }
      }
    },
    methods: {
      async save() {
        const response = await fetch(`${baseUrl}`, {
          method: "PUT",
          body: JSON.stringify({
            _id: this.document._id,
            name: this.document.name,
            content: this.document.content
          }),
          headers: {
            "Content-type": "application/json"
          }
        })
        if (response.status === 500) {
          const result = await response.json()
          console.log(result.errors)
        }
  
      },
    }
  }
  </script>
  
  <template>
    <div class="block">
      <input class="input is-size-3" v-model="document.name" @change="save()">
      <ckeditor :editor="editor" v-model="document.content" :config="editorConfig" @input="save()"></ckeditor>
      <button class="button is-success" @click="save">Save</button>
    </div>
  </template>
  
  <style scoped>
  .input.is-size-3 {
    padding: 10px;
  }
  </style>