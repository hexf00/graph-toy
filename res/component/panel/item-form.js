Vue.component('item-form', {
  template: /*html*/`<div>
    <p v-if="type == 'Node'">
      type:{{type}}
    </p>
    <p v-else>
      {{data.source}} =={{data.label}}==>
      {{data.target}}
    </p>
    {{data}}
    <p>label：<input type="text" v-model="data.label" name="label"></p>
    <p v-if="type == 'Node'">分类：<input type="text" v-model="data.category"
          name="category"></p>
    <p v-if="type == 'Node'">类型：
      <select v-model="data.type">
          <option value="">无</option>
          <option value="word">词语</option>
          <option value="entity">实体</option>
          <option value="class">类</option>
      </select>
    </p>
    <div>
      <div>描述:</div>
      <textarea style="width: 98%;min-height: 150px;" type="text"
          v-model="data.description" name="description"></textarea>
    </div>
    <button type="button" @click="save">保存</button>

  </div>`,
  props: {
    type: String,
    item: Object,
  },
  watch: {
    item() {
      this.data = JSON.parse(JSON.stringify(this.item))
    }
  },
  data() {
    // 初始化时执行,只会执行一次
    return {
      data: JSON.parse(JSON.stringify(this.item))
    }
  },
  methods: {
    save(e) {
      this.$emit("focusNode", e.target.dataset.id)
    }
  }
})
