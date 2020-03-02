function GraphEditorService({ dataLayer, eventSquare }) {
  this.dataLayer = dataLayer
  this.eventSquare = eventSquare
}

GraphEditorService.prototype.updateItem = function (command) {
  return this.dataLayer.batch([command])
}

GraphEditorService.prototype.buildNodeStyle = function (node) {
  var labelFill = {
    word: '#fdf72f',//黄色
    entity: '#9ba0ff',//蓝色
    class: '#ce621d',//橙色
  }

  var style = {};

  if (node.type) {
    style.fill = labelFill[node.type]
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
      //3.2 无效
      type: 'quadratic', // 指定边的形状为二阶贝塞尔曲线
      style: {
        endArrow: true,
        lineWidth: 2
      }
    },
    nodeStateStyles: {
      selected: {
        // hover 状态为 true 时的样式
        stroke: '#ff5959',
        shadowColor: '#aaa',
        shadowBlur:30,
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
        shadowColor: '#aaa',
        shadowBlur:30,
      }
    },
    dataLayer: this.dataLayer, //绑定数据层实例
    eventSquare: this.eventSquare,//绑定事件广场实例
    animate: true            // Boolean，可选，切换布局时是否使用动画过度
  });

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

  graph.data(g6Data);
  graph.render();
  return graph;
}
