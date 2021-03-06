// 事件广场


// 负责 数据层、各数据消费实例 之间的联通、数据同步工作
// 本身不存储任何数据

var EventSquare = function (producer) {

  //services
  this.services = {}

  //数据生产者
  this.producer = producer

  //数据消费者
  this.consumers = {
    g6: [],
    vue: [],
  }

  this.producer.on("batch", (commands) => {
    this.consumers.g6.forEach((consumer) => {
      var graph = consumer.graph;

      const autoPaint = graph.get('autoPaint');
      graph.setAutoPaint(false);

      commands.forEach((command) => {
        if (command.action == "insert") {
          let model = Object.assign({}, command.model)
          if (command.type == "node") {
            model.style = this.services.graphEditorService.buildNodeStyle(model)
          }

          graph.addItem(command.type, model)
        } else if (command.action == "delete") {
          graph.removeItem(graph.findById(command.id))
        } else if (command.action == "update") {
          //command.model只包含更新过的部分字段
          let model = Object.assign({}, command.model)
          if (command.type == "node") {
            //如果仅仅改动了位置,是不需要重新计算样式的
            let mergeModel = Object.assign({}, this.producer.itemMap[command.id], command.model)
            model.style = this.services.graphEditorService.buildNodeStyle(mergeModel)
          }
          graph.updateItem(graph.findById(command.id), model)
        } else {
          console.error("未知command类型", command)
        }
      })

      graph.paint();
      graph.setAutoPaint(autoPaint);
    })
    return commands
  }).on("batch", (commands) => {
    console.log(`操作更新了${commands.length}条数据，注意及时保存。`)
  }).on("changeData", (data) => {
    this.consumers.g6.forEach((consumer) => {
      const graph = consumer.graph
      let g6Data = this.services.graphEditorService.buildG6Data(data)
      graph.changeData(g6Data)
    })
  })

  this.scheduler = new Scheduler()

  //G6通知Vue显示属性面板
  this.scheduler.on("g6FocusItem", ({ type, model }) => {
    this.consumers.vue.forEach((consumer) => {
      var vm = consumer;
      vm.focusItem(type, model.id);
    })
  })

  //Vue通知G6将节点放在画布中心
  this.scheduler.on("vueFocusNode", (id) => {
    this.consumers.g6.forEach((consumer) => {
      var graph = consumer.graph;

      //参考g6.antv.vision/zh/examples/interaction/position
      var item = graph.findById(id);

      //取消其它已经选择
      const selectedNodes = graph.findAllByState('node', 'selected');
      selectedNodes.forEach(cn => {
        graph.setItemState(cn, 'selected', false);
      });
      graph.setItemState(item, 'selected', true);

      // 聚焦当前点击的节点（把节点放到视口中心）

      const matrix = item.get('group').getMatrix();
      const point = {
        x: matrix[6],
        y: matrix[7]
      };
      const width = graph.get('width');
      const height = graph.get('height');
      // 找到视口中心
      const viewCenter = {
        x: width / 2,
        y: height / 2
      };
      const modelCenter = graph.getPointByCanvas(viewCenter.x, viewCenter.y);
      const viewportMatrix = graph.get('group').getMatrix();
      // 画布平移的目标位置，最终目标是graph.translate(dx, dy);
      const dx = (modelCenter.x - point.x) * viewportMatrix[0];
      const dy = (modelCenter.y - point.y) * viewportMatrix[4];
      let lastX = 0;
      let lastY = 0;
      let newX = void 0;
      let newY = void 0;
      // 动画每次平移一点，直到目标位置
      graph.get('canvas').animate({
        onFrame: function onFrame(ratio) {
          newX = dx * ratio;
          newY = dy * ratio;
          graph.translate(newX - lastX, newY - lastY);
          lastX = newX;
          lastY = newY;
        }
      }, 300, 'easeCubic');

    })
  })

  //重新布局
  this.scheduler.on("relayout", (layoutConfig) => {
    layer.msg('加载中', {
      icon: 16,
      shade: 0.01,
      time: 100
    });
    //UI卡死,延迟执行
    setTimeout(() => {

      this.consumers.g6.forEach((consumer, i) => {
        console.time("rerender")
        // 默认方案
        // var graphWrapper = consumer

        // 性能优化方案，使用新的graphWrapper会让代码更快，减少运行时间500ms+
        let dom = consumer.dom;
        consumer.destroy();
        var graphWrapper = new GraphWrapper({
          dataLayer: this.producer,
          eventSquare: this,
          dom: dom
        })
        this.consumers.g6[i] = graphWrapper


        // 重新初始化
        var graph = graphWrapper.init();

        // 性能优化方案，需要渲染一次，否则会导致filterFunc中部分方法无法正常工作
        graph.data({ nodes: [], edges: [] });
        graph.render();

        if (layoutConfig.filterScript) {
          let filterFunc = new Function('graph', 'dataLayout', 'layoutConfig', layoutConfig.filterScript)
          filterFunc(graph, this.producer, layoutConfig)
        }

        let g6Data = this.services.graphEditorService.buildG6Data(this.producer.data, layoutConfig)
        graph.data(g6Data)
        graph.render();

        console.timeEnd("rerender")
      })

    }, 30)

  })

  //在外部监听，使用场景：1. g6通知vue实例激活指定节点的编辑面板
  this.on = this.scheduler.on.bind(this.scheduler)
  this.emit = this.scheduler.emit.bind(this.scheduler)
}

// 注册G6实例
EventSquare.prototype.addGraph = function (graphWrapper) {
  this.consumers.g6.push(graphWrapper)
}

// 注销G6实例
EventSquare.prototype.removeGraph = function (graphWrapper) {
  var graphWrapperIndex = this.consumers.g6.indexOf(graphWrapper)
  if (graphWrapperIndex !== -1) {
    this.consumers.g6.splice(graphWrapperIndex, 1)
  }
}

// 注册Vue实例
EventSquare.prototype.addVue = function (vm) {
  this.consumers.vue.push(vm)
}

// 销毁
EventSquare.prototype.destroy = function (vm) {
  //g6画布需要销毁，否则DOM被占用无法
  this.consumers.g6.forEach(graphWrapper => graphWrapper.destroy())
  this.scheduler.destroy()
}
