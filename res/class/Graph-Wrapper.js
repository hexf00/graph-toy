// GraphWrapper 的目的是为了使用g6销毁方法重新复用DOM
// 新画布渲染比在已有画布渲染要2-3倍

var GraphWrapper = function ({ dataLayer, eventSquare, dom }) {
  this.graph = null
  this.dom = dom
  this.dataLayer = dataLayer
  this.eventSquare = eventSquare
}

// init
GraphWrapper.prototype.init = function () {
  if (this.graph) {
    this.destroy()
  }

  this.graph = new G6.Graph({
    container: this.dom,  // String | HTMLElement，必须，容器 id 或容器本身
    width: Math.floor(this.dom.clientWidth),              // Number，必须，图的宽度
    height: Math.floor(this.dom.clientHeight),             // Number，必须，图的高度
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
    layout: {
      //不能给type赋默认值，否则会导致位置信息丢失
      // type: 'fruchterman',
      // gravity: 1,              // 可选
      // speed: 5,                 // 可选
      // maxIteration: 2000
    },

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

  return this.graph;
}

// 销毁
GraphWrapper.prototype.destroy = function () {
  this.graph.destroy();
  this.graph = null
}
