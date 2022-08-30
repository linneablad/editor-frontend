<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  data() {
    return {
      doc: "",
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'undo', 'redo',],
      }
    }
  },
  methods: {
    save() {
      console.log(this.doc)
    },
  }
}
</script>

<template>
  <main>
    <button @click="save">Save</button>
    <ckeditor :editor="editor" v-model="doc" :config="editorConfig"></ckeditor>
  </main>
</template>
