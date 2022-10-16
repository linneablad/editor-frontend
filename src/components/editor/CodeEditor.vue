<script>
import MonacoEditor from "monaco-editor-vue3";
import { useStore } from "../../stores/index";

export default {
  props: ["document"],
  components: {
    MonacoEditor,
  },
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  data() {
    return {
      output: 'Press button "Run code" to see output...',
      options: {
        colorDecorators: true,
        lineHeight: 24,
        tabSize: 4,
      },
    };
  },
  watch: {
    'document.content'() {
      this.update()
    }
  },
  methods: {
    update() {
      this.store.socketUpdate(this.document)
      this.store.setEditDoc(this.document);
    },
    async runCode() {
      this.output = await this.store.runCode(this.document.content)
    }
  },
};
</script>
  
<template>
  <div>
    <MonacoEditor
    theme="vs-dark"
    :options="options"
    language="javascript"
    :width="800"
    :height="400"
    v-model:value="document.content"
    class="code-editor"
    ></MonacoEditor>
    <button class="button is-success" @click="runCode">Run code</button>
    <div class="output">
      {{output}}
    </div>
  </div>
</template>
  
<style scoped>
  .output {
    float: right;
    height: 360px;
    width: 446px;
    background-color: #1E1E1E;
    color: #D4D4D4;
    padding: 5px;
  }
  .code-editor {
    float: left;
  }

  @media screen and (max-width: 1407px) {
  .output {
    float: none;
    width: 800px;
  }
  .code-editor {
    float: none;
  }
}
</style>
