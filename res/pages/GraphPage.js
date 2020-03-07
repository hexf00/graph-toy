let GraphPage = Vue.component('graph-page', {
  template: /*html*/`<div>

      <div style="position:fixed;z-index:999999">
        <router-link to="/">主页</router-link>
        <button @click="saveManager.exportData()">导出</button>
        <button @click="$refs.importData.click()">导入</button>
        <input ref="importData" type="file" @change="saveManager.importData($event)" name="" id="fileSelect" style="width:0px;height:1px;">
        
        <button @click="showConfig">配置</button>
        <span>未导出改动:{{saveManager.changeCount}}</span>

        <modal ref="editorConfig" :show-footer="false">
          <editor-config></editor-config>
        </modal>

        <tab v-model="leftTabActve" class="tab left-bar">
          <panel title="节点" class="search-bar">
            <node-list :data="dataLayer.data.nodes" @focusNode="focusNode"></node-list>
          </panel>
          <panel title="一般概念" class="search-bar">
            <node-list :data="classList" @focusNode="focusNode"></node-list>
          </panel>
          <panel title="图布局" class="search-bar">
            <layout-list v-model="dataLayer.data.layouts" @input="layoutsUpdate" @relayout="relayout"></layout-list>
          </panel>
        </tab>

        <tab v-model="rightTabActve"  class="tab attr-bar">
          <panel title="属性" class="search-bar">
            <div v-if="editItem">
              <node-form v-if="editType == 'node'" ref="itemForm" type="node" :item="editItem" :extraData="editItemExtraData" @updateItem="updateItem"></node-form>
              <edge-form v-if="editType == 'edge'" ref="itemForm" type="edge" :item="editItem" :extraData="editItemExtraData" @updateItem="updateItem"></edge-form>
            </div>
            <div v-else>未选择节点或属性</div>
          </panel>
          <panel title="JSON">
            <pre v-html="JSON.stringify(editItem,null,2)"></pre>
          </panel>
        </tab>
      </div>

      <div style="position:absolute;width:100%;height:100%;overflow-y: hidden;">      
        <div ref="graph" class="graph"></div>
      </div>
    
    </div>`,
  computed: {
    'classList'() {
      // console.log("classList更新",JSON.stringify( this.dataLayer.data.nodes))
      //新加入的节点不会触发更新
      return this.dataLayer.data.nodes.filter(node => node._type === 'class')
    }
  },
  data() {
    return {
      leftTabActve: '节点',
      rightTabActve: '属性',
      loading: true,
      editType: "",//node or edge
      editItem: null,
      editItemExtraData: {},//额外数据,如边的数据
      dataLayer: {
        data: {
          nodes: [],
          edges: [],
          layouts: []
        }
      },
      graphEditorService: null,
      saveManager: {
        changeCount: 0,
      },
    }
  },
  methods: {
    layoutsUpdate() {
      //手工保存
      this.saveManager.saveToLocalStorage();
    },
    relayout(config) {
      // console.log(config)
      this.eventSquare.emit("relayout", config)
    },
    showConfig() {
      this.$refs.editorConfig.open("图编辑器配置")
    },
    //node-list触发的方法
    focusNode(id) {
      this.focusItem("node", id)
      //在事件广场中通知G6聚焦节点到中心
      this.eventSquare.emit("vueFocusNode", id)
    },
    //G6触发的方法,激活Vue属性面板
    focusItem(type, id) {
      if (!id) {
        //可能存在动态连线
        return
      }
      if (this.$refs.itemForm && this.$refs.itemForm.hasChange()) {
        //产品设计上有2种逻辑,保存后继续操作/取消也继续/取消则取消当前操作
        //因为两种操作逻辑不可共存,根据要执行操作的不同给出正确的提示即可.
        if (confirm("属性数据发生更改,是否保存后继续?")) {
          this.$refs.itemForm.submit()
        }
      }

      this.editType = type

      //保留引用用来判断
      this.editItem = this.dataLayer.itemMap[id]
      if (type == "edge") {
        this.editItemExtraData = {
          soureItem: this.dataLayer.itemMap[this.editItem.source],
          targetItem: this.dataLayer.itemMap[this.editItem.target]
        }
      }

      //动态特征 节点选择器用
      this.editItemExtraData.dataLayer = this.dataLayer

      //属种关系
      this.editItemExtraData.classList = this.classList

      // 如果激活输入框则不方便delete操作
      // this.$nextTick(() => {
      //   this.$refs.itemForm.focusLabel()
      // })
    },
    updateItem(command) {
      this.graphEditorService.updateItem(command).then(() => {
        notify.success("数据更新成功")
      }).catch((err) => {
        notify.error("更新数据时出错", err)
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
    layer.msg('加载中', {
      icon: 16,
      shade: 0.01,
      time: 100
    });

    //内部操作会阻塞UI，使用settimeout延迟执行
    setTimeout(() => {
      graphService.getByName(to.params.graphName).then((data) => {
        next(vm => vm.onGetDataDone(data))
      }).catch((err) => {
        next(vm => vm.onGetDataFail(err))
      })
    }, 30)

  },
  //重复进入要重置数据后再初始化数据,或者直接更新数据
  beforeRouteUpdate(to, from, next) {
    layer.msg('加载中', {
      icon: 16,
      shade: 0.01,
      time: 100
    });
    this.eventSquare.destroy(); //重要
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
      // 可以做成配置式的
      // console.log("存在没有保存的数据,应该提示用户导出保存");
      this.saveManager.exportData(); //强行保存
      notify.success("已自动导出修改后的版本。")
      this.saveManager.destroy();
      this.eventSquare.destroy();
      this.dataLayer.destroy();
      next();
    } else {
      next();
    }
  }
})
