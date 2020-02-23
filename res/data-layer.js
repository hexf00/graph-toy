
// 使用数据层统一多个G6实例的数据

// 好处：只存储和关注关键数据的改动，无需做转换
//    如G6中会添加一些位置和样式信息，edge.startPoint/endPoint 可以根据关系计算出来，一些样式信息不存储

var DataLayer = function (data) {
  let dataLayer = this
  this.data = data
  this.graphs = []

  // commands 
  // {type:node/edge, action:insert/delete/update, id:'', where:[], model:{}}

  //其实也可以不使用scheduler，做成函数直接调用DataLayer的方法也是一样的，且可以拿到返回值
  this.scheduler = new Scheduler()
    .on('batch', function (commands) {
      var actions = [];
      commands.forEach(command => {
        if (command.action == "insert") {
          actions.push(dataLayer.addItem(command))
        }
      })

      return Promise.all(actions).catch((e) => {
        console.error("数据层 insert 时出错")
        return Promise.reject(e)
      })
    }).on('update', function () {

    }).on('delete', function () {

    }).on('insert', function () {

    })
}

DataLayer.prototype.addItem = function (command) {
  let { type, model } = command
  return new Promise((resolve, reject) => {
    this.data[type + "s"].push(model)
    resolve(command)
  })
}

// 注册G6实例
DataLayer.prototype.addGraph = function (graph) {
  this.graphs.push(graph)
}

// 注销G6实例
DataLayer.prototype.removeGraph = function (graph) {
  var graphIndex = this.graphs.indexOf(graph)
  if (graphIndex !== -1) {
    this.graphs.splice(graphIndex, 1)
  }
}