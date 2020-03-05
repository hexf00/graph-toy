Vue.component('characteristic-config-form', {
  template: /*html*/`<div>
      <table v-if="list.length > 0">
        <tr><td>特征名称</td><td>特征输入控件</td></tr>
        <tr v-for="item,i in list">
          <td>
            <input type="text" v-model="item.name" @input="submit">
          </td>
          <td>
            <select v-model="item.control.type">
              <option value="text" @input="submit">文本框</option>
            </select>
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
    }
  },
  methods: {
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
