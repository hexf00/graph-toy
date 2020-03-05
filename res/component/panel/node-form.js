Vue.component('node-form', {
  mixins: [itemForm],
  template: /*html*/`<div>
    <p>label：<input type="text" ref="label" v-model="data.label" name="label" @keyup.enter="submit"></p>
    <p>属种关系：
      <!--<input type="text" v-model="data.category" name="category">-->
      <select v-model="data.category">
        <option v-for="node in extraData.classList" :value="node.id">{{node.label}}</option>
      </select>
    </p>
    <p>节点类型：
      <select v-model="data._type">
          <option value="">无</option>
          <option value="word">词语</option>
          <option value="entity">个体概念</option>
          <option value="class">一般概念</option>
      </select>
    </p>

    
    <div>
      <div>描述:</div>
      <textarea style="width: 98%;min-height: 100px;" type="text"
          v-model="data.description" name="description"></textarea>
    </div>

    
    <div v-if="data._type == 'class'">
      <div>添加公共特征</div>
      <characteristic-config-form v-model="data.characteristic"></characteristic-config-form>
    </div>
    
    <!--<div>
    <div>动态脚本:</div>
      <textarea style="width: 98%;min-height: 50px;" type="text"
        v-model="data.script" name="script"></textarea>
    </div>
    -->
    <button type="button" @click="submit">保存</button>

  </div>`
})
