Vue.component('editor-config', {
  template: /*html*/`<div>
        <div>
          点击节点/边后是否激活名称输入框: <input type="checkbox">
        </div>
        <div>
          实体节点文字是否展示分类字段: <input type="checkbox">
        </div>
        <div>
          是否显示分类节点: <input type="checkbox">
        </div>
        <div>
          是否显示分类节点的连线: <input type="checkbox">
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
