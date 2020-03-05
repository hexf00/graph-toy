Vue.component('node-selector', {
  template: /*html*/`<div>
    <div>
      <span v-for="node in selectedList">{{node.label}}</span>
    </div>
    <input type="text" @click.stop="inputClick">
    <div ref="list" @click.stop>
      <div v-for="node in nodeList" :value="node.id" @click="click(node)">
      <span v-if="data.indexOf(node.id) !== -1">✅</span><span>{{node.label}}</span>
      </div>
    </div>
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
      data: this.value,
    }
  },
  mounted() {
    window.addEventListener("click", () => {
      this.hiddenList()
    })
  },
  methods: {
    hiddenList() {
      this.$refs.list.hidden = true
    },
    inputClick() {
      this.$refs.list.hidden = false
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
