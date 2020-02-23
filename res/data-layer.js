
// 使用数据层统一多个G6实例/vue实例的数据

// 好处：数据以数据层为准，只存储和关注关键数据的改动，导出时无需做转换
//    如G6中会添加一些位置和样式信息，edge.startPoint/endPoint 可以根据关系计算出来，一些样式信息不存储

var DataLayer = function (data) {
  this.data = data


  this.scheduler = new Scheduler()
  //在外部监听，使用场景：1可以实现数据变动时数据自动保存到磁盘、2写操作日志等、3通知其它实例进行更新数据等
  this.on = this.scheduler.on.bind(this.scheduler)
}

/**
 * @param commands {type:node/edge, action:insert/delete/update, id:'', where:[], model:{}}
 */
DataLayer.prototype.batch = function (commands) {


  var actions = [];
  commands.forEach(command => {
    if (command.action == "insert") {
      actions.push(this.addItem(command))
    }
  })

  return Promise.all(actions).then(() => {
    this.scheduler.emit("batch", commands)
  }).catch((e) => {
    console.error("数据层 insert 时出错")
    return Promise.reject(e)
  })
}

DataLayer.prototype.addItem = function (command) {
  let { type, model } = command
  return new Promise((resolve, reject) => {
    this.data[type + "s"].push(model)
    resolve(command)
  })
}

