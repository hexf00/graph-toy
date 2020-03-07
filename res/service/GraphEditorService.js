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

      if (empty) {
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
      if (repeat) {
        return reject(`特征名称${repeat.name}发生重复`)
      }

    }
    resolve()
  })
}

GraphEditorService.prototype.updateItem = function (command) {
  return this.checkUpdateData(command).then(() => {
    //强制Vue为动态添加的属性添加监听

    for (const key in command.model) {
      if (command.model.hasOwnProperty(key)) {
        Vue.set(this.dataLayer.itemMap[command.id], key, command.model[key])
      }
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

GraphEditorService.prototype.init = function ({ dom }) {
  var graphWrapper = new GraphWrapper({
    dataLayer: this.dataLayer,
    eventSquare: this.eventSquare,
    dom: dom
  })

  // 灵异事件：启用setTimeout会导致速度大幅度下降 300ms->1000ms 1.5s->2s
  // setTimeout(() => {
  console.time("render")
  var graph = graphWrapper.init()
  var g6Data = this.buildG6Data(this.dataLayer.data);
  graph.data(g6Data);
  graph.render();
  console.timeEnd("render")
  // }, 0)
  return graphWrapper;
}

//纯粹的数据处理函数
GraphEditorService.prototype.buildG6Data = function (data, layoutConfig) {

  // 不能让g6实例污染数据层的数据
  var g6Data = JSON.parse(JSON.stringify(data));

  let dynamicEdges = {
    category: {
      label: '属种关系',
      deny: ['数据图表'],
    },
    // alias: 'alias',
    // family: 'family',
    // purpose: 'purpose',
    // coord: 'coord',
    // shape: 'shape',
    // channel: 'channel',
    // 图表分类: '图表分类'
  }


  // 对G6数据添加预处理
  g6Data.nodes.forEach(node => {
    // 开启后显示属种关系，动态连线
    Object.keys(dynamicEdges).forEach(k => {
      if (node.hasOwnProperty(k) && node[k] instanceof Array) {
        node[k].forEach(v => {
          if (k == 'category') {

            let edge = {
              source: v,
              target: node.id
            }
            let dynamicEdgeConfig = dynamicEdges[k]

            if (dynamicEdgeConfig instanceof Object) {
              if (dynamicEdgeConfig.deny.indexOf(v) === -1) {
                edge.label = dynamicEdgeConfig.label
                g6Data.edges.push(edge)
              }
            } else {
              edge.label = dynamicEdgeConfig
              g6Data.edges.push(edge)
            }

          } else {
            g6Data.edges.push({
              source: node.id,
              target: v,
              label: dynamicEdges[k]
            })
          }
        })
      }
    })



    // if (node.平台) {
    //   g6Data.edges.push({
    //     source: node.id,
    //     target: node.平台,
    //     label: '平台'
    //   })
    // }


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