
// 使用数据层统一多个G6实例/vue实例的数据

// 好处：数据以数据层为准，只存储和关注关键数据的改动，导出时无需做转换
//    如G6中会添加一些位置和样式信息，edge.startPoint/endPoint 可以根据关系计算出来，一些样式信息不存储
//  边的位置信息不存储，这些可以通过计算得出，且计算过程较为复杂
//  定位：只存储对数据的操作，不涉及具体实例的如何操作改变，以事件的形式通知
// 需要注意： 数据层不验证数据一致性
//  如删除node，需要删除所有node关联的edge，需要外部依次传递调用，否则不会删除
// 如添加连接，不验证联系是否重复
// 相比原来的直接调用removeItem 这里的确变得繁琐，改变node位置，需要重新计算edge位置也是相同

/**
 * 
 * @param {nodes:[],edges:[]} data 
 */
var DataLayer = function (data) {
  this.data = data
  this.itemMap = {}


  var mapItemInit = (model) => {
    if (!this.itemMap[model.id]) {
      this.itemMap[model.id] = model
    } else {
      //id重复
      console.error("id重复", model);
    }
  }
  this.data.nodes.forEach(mapItemInit)
  this.data.edges.forEach(mapItemInit)

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
    } else if (command.action == "delete") {
      actions.push(this.deleteItem(command))
    } else if (command.action == "update") {
      actions.push(this.updateItem(command))
    } else {
      console.error("未定义到 batch 操作类型", command.action)
    }
  })

  return Promise.all(actions).then(() => {
    this.scheduler.emit("batch", commands)
  }).catch((e) => {
    console.error("数据层 batch 时出错", e)
    return Promise.reject(e)
  })
}

DataLayer.prototype.addItem = function (command) {
  let { type, model } = command
  return new Promise((resolve, reject) => {
    this.data[type + "s"].push(model)
    this.itemMap[model.id] = model
    resolve(command)
  })
}

DataLayer.prototype.updateItem = function (command) {
  let { type, id, model } = command
  return new Promise((resolve, reject) => {
    let item = this.itemMap[id]

    for (const key in command.model) {
      const val = command.model[key];
      if (item[key] !== val) {
        item[key] = val
      }
    }

    resolve(command)
  })
}


//删除node不会删除edges，暂时这样实现
DataLayer.prototype.deleteItem = function (command) {
  let { type, id } = command
  return new Promise((resolve, reject) => {

    var item = this.itemMap[command.id]
    if (id) {
      delete this.itemMap[id];

      var itemIndex = this.data[type + 's'].indexOf(item)
      if (itemIndex !== -1) {
        this.data[type + 's'].splice(itemIndex, 1)
      } else {
        console.warn(`delteItem ${type}s 中找不到item`, command)
      }

    } else {
      console.warn("delteItem itemMap中找不到item", command)
    }

    resolve(command)
  })
}

