let IndexPage = Vue.component('index-page', {
  template: /*html*/`<div>
    <div v-if="loading">loading</div>
    <edit-graph></edit-graph>
    <ul>
      <li></li>
    </ul>
  </div>`,
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    getData() {
      return new Promise((resolve) => {
        resolve({})
      })
    },
    onDone(data) {
      //重置数据
      //设置数据
    },
    onFail(err) {
      console.error("出错了")
    },
  },
  //第一次进入
  beforeRouteEnter(to, from, next) {
    this.getData().then((data) => {
      next(vm => vm.onDone(data))
    }).catch(this.onFail)
  },
  //重复进入只更新数据
  beforeRouteUpdate(to, from, next) {
    this.getData().then((data) => {
      this.onDone(data)
      next()
    }).catch(this.onFail)
  },
})
