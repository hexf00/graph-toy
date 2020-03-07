Vue.component('layout-list', {
  template: /*html*/`<div class="node-list">
    <modal v-if="editItem" ref="scriptEditor" @done="update">
      <div>布局名称：<input v-model="editItem.name" type="text" /></div>
      <div>布局脚本：<textarea v-model="editItem.filterScript" style="width:100%;height:150px" type="text"></textarea></div>
      <button @click="preview">预览布局</button>
    </modal>
    <ul>
      <li style="text-align: center;font-weight: bold;">预置布局</li>
      <li v-for="layout,i in defaultList">
        {{layout.name}}
        <a @click="relayout(layout)" href="javascript:;">应用</a>
        <a @click="clone(layout)" href="javascript:;">克隆</a>
      </li>

      <li style="text-align: center;font-weight: bold;" v-if="list.length > 0">图表布局</li>
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
        },
        {
          name: "force布局",
          filterScript: `
          graph.updateLayout({
            type: 'force',            // 设置布局算法为 force
            linkDistance: 100,        // 设置边长为 100
            preventOverlap: true,     // 设置防止重叠
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
    preview() {
      this.$emit('relayout', this.editItem)
    },
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
    clone(layout) {
      this.list.push({ ...layout })
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
