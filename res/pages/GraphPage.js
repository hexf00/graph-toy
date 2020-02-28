let GraphPage = Vue.component('graph-page', {
  template: /*html*/`<div>
      <div style="position:absolute;width:100%;height:100%;overflow-y: hidden;">
        <div ref="graph" class="graph"></div>
      </div>
      
    </div>`,
  data() {
    return {
      loading: true,
    }
  },
  methods: {

    getData() {

    },
    onGetDataDone(data) {
      //重置数据
      this.loading = false

      //设置数据

      var dataLayer = new DataLayer(data.data);

      var graph = graphEditorService.init({
        dom: this.$refs.graph,
        data: data.data,
        dataLayer
      })

      var eventSquare = new EventSquare(dataLayer);
      eventSquare.addGraph(graph);

      var saveManager = new SaveManager({
        dataLayer,
        localStorageKey: `graph-dataset-item-${data.id}`,
        graphName: data.name
      });





    },
    onGetDataFail(err) {
      this.loading = false

      console.error("出错了", err)
    },
  },
  //第一次进入，无法通过this读取组件实例
  beforeRouteEnter(to, from, next) {
    graphService.getByName(to.params.graphName).then((data) => {
      next(vm => vm.onGetDataDone(data))
    }).catch((err) => {
      next(vm => vm.onGetDataFail(err))
    })
  },
  //重复进入要重置数据后再初始化数据,或者直接更新数据
  beforeRouteUpdate(to, from, next) {
    this.loading = true
    this.list = []
    graphService.getByName(to.params.graphName).then((data) => {
      this.onGetDataDone(data)
      next()
    }).catch(this.onGetDataFail)
  },
})
