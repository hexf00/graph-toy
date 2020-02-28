Vue.component('edit-graph', {
  template: /*html*/`<div>
      名称：<input type="text" v-model="data.name">
      <button @click="submit">{{submitBtnShowText[mode]}}</button>
  </div>`,
  props: {
    mode: String, //add|edit
    info: {
      type: Object,
      default: () => {
        return {
          name: ""
        }
      }
    },
  },
  data() {
    return {
      submitBtnShowText: {
        add: "创建",
        edit: "保存",
      },
      data: {
        name: this.info && this.info.name,
        id: this.info && this.info.id
      }
    }
  },
  methods: {
    submit() {
      if (this.mode === "add") {
        this.add().then(() => {
          this.$emit("savedone")
        }, err => this.$emit("savefail", err))
      } else {
        this.update().then(() => {
          this.$emit("savedone")
        }, err => this.$emit("savefail", err))
      }
    },
    add() {
      return graphService.add(this.data)
    },
    update() {
      return graphService.update(this.info, this.data)
    }
  }
})
