Vue.component('layout-list', {
  template: /*html*/`<div class="node-list">
    <modal v-if="editItem" ref="scriptEditor" @done="update">
      <div>布局名称：<input v-model="editItem.name" type="text" /></div>
      <div>布局脚本：<textarea v-model="editItem.filterScript" style="width:100%;height:150px" type="text"></textarea></div>
    </modal>
    <ul>
      <li v-for="layout,i in defaultList">
        {{layout.name}}
        <a @click="relayout(layout)" href="javascript:;">应用</a>
      </li>
      <li v-for="layout,i in list">
          {{layout.name}}
          <a @click="relayout(layout)" href="javascript:;">应用</a>
          <a @click="showScriptEditor(layout)" href="javascript:;">配置</a>
          <a @click="remove(i)" href="javascript:;">删除</a>
      </li>
    </ul>
    <div><a @click="add" href="javascript:;">添加布局</a></div>
  </div>`,
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }, //
  },
  watch: {
    value() {
      this.list = this.value
    }
  },
  data() {
    return {
      defaultList: [
        {
          name: "默认布局",
          filterScript: ""
        },
        {
          name: "fruchterman布局",
          filterScript: `
          graph.updateLayout({
            type: 'fruchterman',
            gravity: 1,              // 可选
            speed: 5,                 // 可选
            maxIteration: 2000
           })
          `
        }
      ],
      list: this.value,
      editItemRaw: null,
      editItem: null,
    }
  },
  methods: {
    relayout(layout) {
      this.$emit('relayout', layout)
    },
    update() {
      this.editItemRaw.name = this.editItem.name
      this.editItemRaw.filterScript = this.editItem.filterScript
      this.$refs.scriptEditor.close()
      this.submit()
    },
    showScriptEditor(item) {
      this.editItemRaw = item
      this.editItem = JSON.parse(JSON.stringify(item))
      this.$nextTick(() => this.$refs.scriptEditor.open("编辑布局脚本配置"))
    },
    remove(index) {
      this.list.splice(index, 1)
      this.submit()
    },
    add() {
      this.list.push({
        name: '新布局',
      })
      this.submit()
    },
    submit() {
      this.$emit("input", this.list)
    }
  }
})
