Vue.component('editor-config', {
  template: /*html*/`<div>
        <tab v-model="tabActiveIndex" style="height:200px">
        <panel title="全局动态属性">
        
      
        </panel>
        <panel title="其它">
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
        </panel>
        </tab>
        <button @click="submit">保存</button>
    </div>`,
  props: {
  },
  data() {
    return {
      tabActiveIndex: "全局动态属性",
      data: {
      }
    }
  },
  methods: {
    submit() {

      this.$emit("savedone")
    }
  }
})
