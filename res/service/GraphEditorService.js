function GraphEditorService({ dataLayer, eventSquare }) {
  this.dataLayer = dataLayer
  this.eventSquare = eventSquare
}
GraphEditorService.prototype.checkUpdateData = function ({ model }) {
  return new Promise((resolve, reject) => {

    if (model.hasOwnProperty('label') && model.label.trim() === "") {
      return reject("请输入节点名称")
    }
    if (model.hasOwnProperty('characteristic')) {

      let empty = model.characteristic.find(it => it.name.trim() === "")

      if(empty){
        return reject(`请输入特征名称`)
      }

      let nameDict = {}
      let repeat = model.characteristic.find(it => {
        if (nameDict.hasOwnProperty(it.name)) {
          return true
        } else {
          nameDict[it.name] = it.name
        }
      })
      if(repeat){
        return reject(`特征名称${repeat.name}发生重复`)
      }

    }
    resolve()
  })
}

GraphEditorService.prototype.updateItem = function (command) {
  return this.checkUpdateData(command).then(() => {
    //强制Vue添加监听，因为默认不存在_type属性
    if (command.model._type) {
      Vue.set(this.dataLayer.itemMap[command.id], '_type', command.model._type)
    }
    if (command.model.characteristic) {
      Vue.set(this.dataLayer.itemMap[command.id], 'characteristic', command.model.characteristic)
    }
    //因为普通方式追加新属性，不会触发vue的响应式，注：已有属性的改变是会触发的
  }).then(() => this.dataLayer.batch([command]))
}

GraphEditorService.prototype.buildNodeStyle = function (node) {
  var styleDict = {
    word: {
      fill: '#fdf72f',//黄色
      stroke: '#ddd',
    },
    entity: {
      fill: '#91d5ff',//蓝色,g6默认色
      stroke: '#ddd',
    },
    class: {
      fill: '#e473db', //紫色
      stroke: '#ddd',
    },
    default: {
      fill: "#ddd", //灰色
      stroke: '#ddd'
    }
  }

  var style = {};

  if (node._type) {
    Object.assign(style, styleDict[node._type])
  } else {
    Object.assign(style, styleDict.default)
  }

  return style
}

GraphEditorService.prototype.init = function ({ dom, data }) {
  const graph = new G6.Graph({
    container: dom,  // String | HTMLElement，必须，容器 id 或容器本身
    width: Math.floor(dom.clientWidth),              // Number，必须，图的宽度
    height: Math.floor(dom.clientHeight),             // Number，必须，图的高度
    // renderer: "svg",
    modes: {
      default: [
        'dblclick-new',
        'shortcut-keys',
        'brush-select',
        'custom-drag-node',
        'item-click',
        'drag-canvas',
        'zoom-canvas',
        'item-hover',
        // 边提示框交互工具的配置
        {
          type: 'edge-tooltip',
          formatText(model) {
            var target = this.graph.findById(model.target).getModel();
            var source = this.graph.findById(model.source).getModel();

            const text = `${source.label} ==${model.label || ""}==> ${target.label}`;
            return text;
          },
          shouldUpdate: e => {
            return true;
          }
        }
      ]
    },
    defaultEdge: {
      type: 'quadratic', // 指定边的形状为二阶贝塞尔曲线 3.2无效
      style: {
        endArrow: true,
        lineWidth: 2
      }
    },
    nodeStateStyles: {
      hover: {
        stroke: '#ff5959',
        lineWidth: 1, //default样式
      },
      selected: {
        // hover 状态为 true 时的样式
        stroke: '#ff5959',
        // g6bug 拖拽后阴影不消失
        // shadowColor: '#aaa',
        // shadowBlur: 30,
      },
    },
    // layout: {
    //     type: 'force',            // 设置布局算法为 force
    //     linkDistance: 150,        // 设置边长为 100
    //     preventOverlap: true,     // 设置防止重叠
    //     nodeSize: 60,
    //     nodeStrength: 10,
    //     edgeStrength: 3,
    // },  

    // 边在各状态下的样式
    edgeStateStyles: {
      hover: {
        stroke: '#ff5959'
      },
      // click 状态为 true 时的样式
      selected: {
        stroke: '#ff5959',
        // g6bug 拖拽后阴影不消失
        // shadowColor: '#aaa',
        // shadowBlur: 30,
      }
    },
    dataLayer: this.dataLayer, //绑定数据层实例
    eventSquare: this.eventSquare,//绑定事件广场实例
    animate: true            // Boolean，可选，切换布局时是否使用动画过度
  });

  let g6Data = this.buildG6Data(data);

  graph.data(g6Data);
  graph.render();
  return graph;
}


GraphEditorService.prototype.buildG6Data = function (data) {
  // 不能让g6实例污染数据层的数据
  var g6Data = JSON.parse(JSON.stringify(data));
  // 对G6数据添加预处理
  g6Data.nodes.forEach(node => {
    node.style = this.buildNodeStyle(node)
  })

  g6Data.edges.forEach((edge) => {
    edge.style = {
      endArrow: true,
      lineWidth: 2
    }
  })
  return g6Data
}