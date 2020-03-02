let itemForm = {
  props: {
    item: Object,
    type: String,
  },
  watch: {
    item() {
      let data = JSON.parse(JSON.stringify(this.item))
      delete data.soureItem
      delete data.targetItem

      this.data = data
    }
  },
  // 初始化时执行,只会执行一次
  data() {
    let data = JSON.parse(JSON.stringify(this.item))
    delete data.soureItem
    delete data.targetItem

    //data是update 比对的数据
    return { data }
  },
  methods: {
    submit(e) {
      var updateModel = {}
      var changeCount = 0
      for (const key in this.data) {
        // 排除拖拽改变了节点的位置
        if (key != 'x' && key != 'y' && this.data[key] !== this.item[key]) {
          updateModel[key] = this.data[key]
          changeCount++
        }
      }

      if (changeCount > 0) {
        this.$emit("updateItem", {
          type: this.type,
          action: "update",
          id: this.item.id,
          model: updateModel,
        })
      } else {
        notify.info("没有修改")
      }
    }
  }
}
