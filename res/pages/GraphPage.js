let GraphPage = Vue.component('graph-page', {
  template: /*html*/`<div>

      <div style="position:fixed;z-index:999999">
        <router-link to="/">主页</router-link>
        <button @click="saveManager.exportData()">导出</button>
        <span>未导出改动:{{saveManager.changeCount}}</span>

        <tab active="节点" class="tab left-bar">
          <panel title="节点" class="search-bar">
            <node-list :data="dataLayer.data.nodes" @focusNode="focusNode"></node-list>
          </panel>
        </tab>

        <tab active="属性" class="tab attr-bar">
          <panel title="属性" class="search-bar">
            <div v-if="editItem">
              <node-form v-if="editType == 'node'" ref="itemForm" type="node" :item="editItem" @updateItem="updateItem"></node-form>
              <edge-form v-if="editType == 'edge'" ref="itemForm" type="edge" :item="editItem" @updateItem="updateItem"></edge-form>
            </div>
            <div v-else>未选择节点或属性</div>
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
      editType: "",//node or edge
      editItem: null,
      dataLayer: {
        data: []
      },
      graphEditorService: null,
      saveManager: {
        changeCount: 0,
      },
    }
  },
  methods: {
    //node-list触发的方法
    focusNode(id) {
      this.focusItem("node", id)
      this.eventSquare.emit("vueFocusNode", id)
    },
    //G6触发的方法,激活Vue属性面板
    focusItem(type, id) {
      this.editType = type

      if (type == "node") {
        this.editItem = this.dataLayer.itemMap[id]
      } else {
        this.editItem = Object.assign({}, this.dataLayer.itemMap[id])
        this.editItem.soureItem = this.dataLayer.itemMap[this.editItem.source]
        this.editItem.targetItem = this.dataLayer.itemMap[this.editItem.target]
      }

      this.$nextTick(() => {
        this.$refs.itemForm.focusLabel()
      })
    },
    updateItem(command) {
      this.graphEditorService.updateItem(command).then(() => {
        notify.success("数据更新成功")
      }).catch((err) => {
        notify.error("更新数据时出错")
      })
    },
    onGetDataDone(data) {
      //重置数据
      this.loading = false

      //设置数据

      this.dataLayer = new DataLayer(data.data);


      this.eventSquare = new EventSquare(this.dataLayer);

      this.graphEditorService = new GraphEditorService({
        dataLayer: this.dataLayer,
        eventSquare: this.eventSquare
      });

      this.eventSquare.services.graphEditorService = this.graphEditorService

      var graph = this.graphEditorService.init({
        dom: this.$refs.graph,
        data: data.data
      })

      this.eventSquare.addGraph(graph);
      this.eventSquare.addVue(this);

      this.saveManager = new SaveManager({
        dataLayer: this.dataLayer,
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
      this.eventSquare.destroy();
      this.dataLayer.destroy();
      next();
    } else {
      next();
    }
  }
})
