Vue.component('editor-config', {
  template: /*html*/`<div>
        <div>
          点击节点/边后是否激活名称输入框: <input type="checkbox">
        </div>
        <div>
          在图中节点是否显示分类: <input type="checkbox">
        </div>
        <button @click="submit">保存</button>
    </div>`,
  props: {
  },
  data() {
    return {
      data: {}
    }
  },
  methods: {
    submit() {

      this.$emit("savedone")
    }
  }
})
