function GraphService() {

}

GraphService.prototype.getData = function () {
  return new Promise((resolve, reject) => {

    try {
      var rawData = localStorage.getItem("graph-dataset");
      var data = [];
      if (rawData) {
        data = JSON.parse(rawData);
      }

      resolve(data);
    } catch (e) {
      reject(e);
    }

  })
}
GraphService.prototype.checkInput = function (data) {
  // 添加id唯一性判断

  return Promise.resolve(() => {
    if (!data.name || data.name.trim().length === 0) {
      return Promise.reject("请输入名称")
    } else {
      return data
    }
  }).then(this.getData).then((list) => {
    if (list.find(item => item.name == data.name && item.id != data.id)) {
      return Promise.reject("该名称已经被使用，请换一个吧")
    } else {
      return data
    }
  })
}
GraphService.prototype.add = function (data) {
  return this.checkInput(data).then(this.getData).then((list) => {

    let id = uuidv4();
    list.unshift({
      name: data.name,
      id: id,
      create_at: new Date()
    })
    localStorage.setItem("graph-dataset", JSON.stringify(list));
    localStorage.setItem("graph-dataset-item-" + id, JSON.stringify({ nodes: [], edges: [] }));

    return true;

  })
}

GraphService.prototype.update = function (item, data) {
  return this.checkInput(data).then(this.getData).then((list) => {

    list.find((it, i) => {
      if (it.id === item.id) {
        list[i].name = data.name
        return true
      }
    })

    localStorage.setItem("graph-dataset", JSON.stringify(list));

    return true;
  })

}


GraphService.prototype.remove = function (data) {
  return this.getData().then((list) => {

    list.find((it, i) => {
      if (it.id === data.id) {
        delete list[i]
        return true
      }
    })

    localStorage.setItem("graph-dataset", JSON.stringify(list.filter(it => it)));
    localStorage.removeItem("graph-dataset-item-" + data.id);

    return true;
  })

}

GraphService.prototype.getByName = function (name) {
  return this.getData().then((list) => {
    let item = list.find((it, i) => {
      if (it.name === name) {
        return true
      }
    })

    if (item) {
      item.data = JSON.parse(localStorage.getItem("graph-dataset-item-" + item.id))

      return item
    } else {
      return Promise.reject("要找的图表不存在，可能已经被删除.")
    }
  })
}

//全局唯一
let graphService = new GraphService();
