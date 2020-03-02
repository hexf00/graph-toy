Vue.component('edge-form', {
  mixins: [itemForm],
  template: /*html*/`<div>
    <p>
      {{extraData.soureItem.label}} =={{item.label}}==>
      {{extraData.targetItem.label}}
    </p>
    <p>label：<input type="text" ref="label" v-model="data.label" name="label"  @keyup.enter="submit"></p>
    <div>
      <div>描述:</div>
      <textarea style="width: 98%;min-height: 150px;" type="text"
          v-model="data.description" name="description"></textarea>
    </div>
    <button type="button" @click="submit">保存</button>

  </div>`
})
