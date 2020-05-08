Vue.component('characteristic-form', {
  template: /*html*/`<div>
      <table>
        <tr><td>属性名称</td><td>属性值</td></tr>
        <tr v-for="item,i in config">
          <td>
            {{item.name}}
          </td>
          <td>
            <input v-if="item.control.type == 'text'" v-model="data[item.name]" type="text" @input="submit">
            <node-selector v-if="item.control.type == 'node'" v-model="data[item.name]" @input="submit" :nodeList="nodeList[i]"></node-selector>
          </td>
        </tr>
      </table>
    </div>`,
  props: {
    value: Object,//必须传入
    config: Array, //必须传入
    dataLayer: Object //必须传入
  },
  watch: {
    value() {
      this.data = this.value
    }
  },
  computed: {
    nodeList() {
      return this.config.map((item) => {

        try {
          if (item.filterScript) {
            let text2id = (text)=>{
              let pageNode = this.dataLayer.data.nodes.find(it=>it.label == text);
              if(pageNode) {
                return pageNode.id;
              }else{
                return false;
              }
            }
            let filterFunc = new Function('dataLayer', 'config', 'text2id', item.filterScript)
            return filterFunc(this.dataLayer, item, text2id)
            // return eval(`(function(dataLayer,config){${item.filterScript}})(this.dataLayer, item)`)
          } else {
            return this.dataLayer.data.nodes
          }
        } catch (error) {
          console.error("过滤脚本执行出错", error)
          return this.dataLayer.data.nodes
        }


      })
    }
  },
  data() {
    return {
      data: this.value,
    }
  },
  methods: {
    submit() {
      this.$emit("input", this.data)
    }
  }
})
