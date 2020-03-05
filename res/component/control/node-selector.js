Vue.component('node-selector', {
  template: /*html*/`<div class="seletor">
    <div @click.stop="show" class="tag-list">
      <span class="tag" v-for="node in selectedList">{{node.label}}</span>
      
      <span>➕</span>
    </div>
    <ul v-show="showList" class="seletor-list" @click.stop>
      <li><input ref="search" type="text" v-model="keyword"></li>
      <li v-for="node in realList" :value="node.id" @click="click(node)">
      <span v-if="data.indexOf(node.id) !== -1">✅</span>
      <span v-else style="width:16px;display:inline-block;"></span>
      <span>{{node.label}}</span>
      </li>
      <li v-show="realList.length == 0">没有数据</li>
    </ul>
  </div>`,
  props: {
    nodeList: Array,
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    realList() {
      if (this.keyword) {
        return this.nodeList.filter(it => it.label.indexOf(this.keyword) !== -1)
      } else {
        return this.nodeList
      }
    },
    selectedList() {
      return this.nodeList.filter(it => this.data.indexOf(it.id) !== -1)
    }
  },
  watch: {
    value() {
      this.data = this.value
    }
  },
  data() {
    return {
      keyword: "",
      data: this.value,
      showList: false,
    }
  },
  mounted() {
    window.addEventListener("click", () => {
      this.showList = false
    })
  },
  methods: {
    show() {
      this.showList = true
      this.$nextTick(() => this.$refs.search.focus())
    },
    click(node) {
      let index = this.data.indexOf(node.id)
      if (index === -1) {
        this.data.push(node.id)
      } else {
        this.data.splice(index, 1)
      }
      // console.log(this.data)
      this.submit()
    },
    submit() {
      this.$emit("input", this.data);
    }
  }
})
