let GraphPage = Vue.component('graph-page', {
  template: /*html*/`<div>

      <div style="position:fixed;z-index:999999">
        <router-link to="/">主页</router-link>
        <button onclick="saveManager.exportData()">导出</button>
        <span>未导出改动:{{saveManager.changeCount}}</span>

        <tab active="节点" class="tab left-bar">
          <panel title="节点" class="search-bar">
            <node-list :data="dataLayer.data.nodes"></node-list>
          </panel>
        </tab>
      </div>

      <div style="position:absolute;width:100%;height:100%;overflow-y: hidden;">      
        <div ref="graph" class="graph"></div>
      </div>
    
    </div>`,
  data() {
    return {
      loading: true,
      dataLayer: {
        data: []
      },
      saveManager: {
        changeCount: 0,
      },
    }
  },
  methods: {
    focusItem(data) {
      console.log(data);
    },
    onGetDataDone(data) {
      //重置数据
      this.loading = false

      //设置数据

      this.dataLayer = new DataLayer(data.data);
      var dataLayer = this.dataLayer;

      var eventSquare = new EventSquare(dataLayer);
      var graph = graphEditorService.init({
        dom: this.$refs.graph,
        data: data.data,
        dataLayer,
        eventSquare
      })

      eventSquare.addGraph(graph);
      eventSquare.addVue(this);

      this.saveManager = new SaveManager({
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
  // 路由离开时间, 作销毁操作
  beforeRouteLeave(to, from, next) {
    if (this.saveManager.changeCount > 0) {
      console.log("存在没有保存的数据,应该提示用户导出保存");
      this.saveManager.destroy();
      next();
    } else {
      next();
    }
  }
})
