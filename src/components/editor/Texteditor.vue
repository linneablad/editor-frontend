<script>
import { useStore } from "../../stores/index";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import jsPDF from "jspdf";

export default {
  props: ["document"],
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
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

  methods: {
    update() {
      this.store.socketUpdate(this.document)
      this.store.setEditDoc(this.document);
    },
    createPDF() {
      const pdfName = this.document.name;
      let doc = new jsPDF();
      doc.html(this.document.content, {
        callback: function (doc) {
          doc.save(pdfName);
        },
        x: 5,
        y: 5,
        width: 793.7,
        windowWidth: 793.7,
        html2canvas: {
          scale: 0.25,
        },
        autoPaging: "text",
      });
    },
  },
};
</script>

<template>
  <div class="block">
    <button class="button" @click="createPDF()">Download as PDF</button>
    <ckeditor
      :editor="editor"
      v-model="document.content"
      :config="editorConfig"
      @input="update()"
    ></ckeditor>
  </div>
</template>