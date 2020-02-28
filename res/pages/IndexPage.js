let IndexPage = Vue.component('index-page', {
  template: /*html*/`<div>
    <div v-if="loading">loading</div>
    
    <a href="javascript:;" @click="showAdd">创建</a>

    <modal ref="remove_modal" @done="remove(removeItem)">
      <div v-if="removeItem">
        删除后不可恢复，是否要删除 <strong>{{removeItem.name}}</strong>？
      </div>
    </modal>

    <modal ref="modal" :show-footer="false">
      <edit-graph :mode="editMode" :info="editItem" @savedone="refresh" @savefail="showError"></edit-graph>
    </modal>

    <div v-if="list.length == 0">
      还没有图，先来添加一个吧。
      <a href="javascript:;" @click="showAdd">创建</a>
    </div>
    <ul v-else>
      <li v-for="item in list">
        {{item.name}} 
        <a href="javascript:;" @click="showEdit(item)">编辑名称</a>
        <a href="javascript:;" @click="removeConfirm(item)">删除</a>

      </li>
    </ul>
  </div>`,
  data() {
    return {
      loading: true,
      editMode: null,
      editItem: null, //要编辑的item
      removeItem: null, //要删除的item
      list: []
    }
  },
  methods: {
    refresh() {
      this.$refs.modal.close()

      this.$router.replace({
        path: '/404',
      })
      this.$router.replace({
        path: '/',
      })
      // this.$router.go(0)
    },
    showError(err) {
      alert(err);
    },
    removeConfirm(removeItem) {
      this.removeItem = removeItem
      this.$refs.remove_modal.open("删除确认")
    },
    remove(item) {
      graphService.remove(item).then(() => this.refresh()).catch(this.showError)
    },
    showAdd() {
      this.editMode = "add"
      this.editItem = null

      this.$refs.modal.open("创建图")
    },
    showEdit(item) {
      this.editMode = "edit"
      this.editItem = item

      this.$refs.modal.open("编辑图名")
    },
    onGetDataDone(data) {
      //重置数据
      this.loading = false
      //设置数据
      this.list = data
    },
    onGetDataFail(err) {
      this.loading = false

      console.error("出错了")
    },
  },
  //第一次进入，无法通过this读取组件实例
  beforeRouteEnter(to, from, next) {
    graphService.getData().then((data) => {
      next(vm => vm.onGetDataDone(data))
    }).catch((err) => {
      next(vm => vm.onGetDataFail(err))
    })
  },
  //重复进入只更新数据
  beforeRouteUpdate(to, from, next) {
    this.loading = true
    this.list = []
    graphService.getData().then((data) => {
      this.onGetDataDone(data)
      next()
    }).catch(this.onGetDataFail)
  },
})
