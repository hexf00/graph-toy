Vue.component('characteristic-config-form', {
  template: /*html*/`<div>
      <modal v-if="editItem" ref="scriptEditor" @done="update">
        <textarea v-model="editItem.filterScript" style="width:100%;height:150px" type="text"></textarea>
      </modal>
      <table v-if="list.length > 0">
        <tr><td>特征名称</td><td>特征值输入控件</td></tr>
        <tr v-for="item,i in list">
          <td>
            <input type="text" v-model="item.name" @input="submit">
          </td>
          <td>
            <select v-model="item.control.type">
              <option value="text" @input="submit">文本框</option>
              <option value="node" @input="submit">节点选择器</option>
            </select>
            
            <a v-if="item.control.type == 'node'" @click="showScriptEditor(item)" href="javascript:;">配置</a>
            <a @click="remove(i)" href="javascript:;">删除</a>
          </td>
        </tr>
      </table>
      <div><a @click="add" href="javascript:;">添加特征</a></div>
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
      list: this.value,
      editItemRaw: null,
      editItem: null,
    }
  },
  methods: {
    update() {
      this.editItemRaw.filterScript = this.editItem.filterScript
      this.$refs.scriptEditor.close()
    },
    showScriptEditor(item) {
      this.editItemRaw = item
      this.editItem = JSON.parse(JSON.stringify(item))
      this.$nextTick(() => this.$refs.scriptEditor.open("编辑过滤脚本配置"))
    },
    remove(index) {
      this.list.splice(index, 1)
      this.submit()
    },
    add() {
      this.list.push({
        name: '',
        control: {
          type: "text"
        }
      })
      this.submit()
    },
    submit() {
      this.$emit("input", this.list)
    }
  }
})
