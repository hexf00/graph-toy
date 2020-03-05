Vue.component('edge-form', {
  mixins: [itemForm],
  template: /*html*/`<div>
    <p>
      {{extraData.soureItem.label}} =={{item.label}}==>
      {{extraData.targetItem.label}}
    </p>
    <div>关系：<input type="text" ref="label" v-model="data.label" name="label"  @keyup.enter="submit"></div>
    <div>
      <div>关系描述:</div>
      <textarea style="width: 98%;min-height: 150px;" type="text"
          v-model="data.description" name="description"></textarea>
    </div>
    <button type="button" @click="submit">保存</button>

  </div>`
})
