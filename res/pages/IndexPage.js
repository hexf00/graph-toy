let IndexPage = Vue.component('index-page', {
  template: /*html*/`<div>
    <div v-if="loading">loading</div>    

    <modal ref="remove_modal" @done="remove(removeItem)">
      <div v-if="removeItem">
        删除后不可恢复，是否要删除 <strong>{{removeItem.name}}</strong>？
      </div>
    </modal>

    <modal ref="modal" :show-footer="false">
      <edit-graph :mode="editMode" :info="editItem" @savedone="savedone" @savefail="showError"></edit-graph>
    </modal>
    <div>
      <div class="header">
        <h1>graph-toy</h1>
        <h2>
          关系图数据编辑器
          <a style="font-size:0.75em" class="button-secondary pure-button" href="https://github.com/hexf00/graph-toy">View on GitHub</a>
        </h2>
      </div>
      <div class="content">
        <div style="margin:1em 0;">
          <a class="pure-button pure-button-primary" href="javascript:;" @click="showAdd">新建数据集</a>
        </div>
        <dataset-list-table :list="list" @action="onAction"></dataset-list-table>

      </div>
    </div>
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
    onAction(funcName) {
      this[funcName].apply(this, Array.from(arguments).splice(1))
    },
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
    savedone() {
      this.refresh()
      notify.success(this.editMode == "add" ? "创建成功" : "命名成功")
    },
    showError(err) {
      notify.error(err)
    },
    removeConfirm(removeItem) {
      this.removeItem = removeItem
      this.$refs.remove_modal.open("删除确认")
    },
    remove(item) {
      graphService.remove(item).then(() => {
        this.refresh()
        notify.success("删除成功")
      }).catch(this.showError)
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
      notify.success(err)
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
