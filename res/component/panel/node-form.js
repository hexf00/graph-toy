Vue.component('node-form', {
  mixins: [itemForm],
  template: /*html*/`<div>
    <p>label：<input type="text" ref="label" v-model="data.label" name="label" @keyup.enter="submit"></p>
    <p>分类：<input type="text" v-model="data.category" name="category"></p>
    <p>类型：
      <select v-model="data._type">
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
    <button type="button" @click="submit">保存</button>

  </div>`
})
