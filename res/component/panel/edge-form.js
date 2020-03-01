Vue.component('edge-form', {
  mixins: [itemForm],
  template: /*html*/`<div>
    <p>
      {{item.soureItem.label}} =={{item.label}}==>
      {{item.targetItem.label}}
    </p>
    <p>label：<input type="text" v-model="data.label" name="label"></p>
    <div>
      <div>描述:</div>
      <textarea style="width: 98%;min-height: 150px;" type="text"
          v-model="data.description" name="description"></textarea>
    </div>
    <button type="button" @click="save">保存</button>

  </div>`
})
