function GraphService() {

}

GraphService.prototype.getData = function () {
  return new Promise((resolve, reject) => {

    try {
      var rawData = localStorage.getItem("graph-data-set");
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
    localStorage.setItem("graph-data-set", JSON.stringify(list));
    localStorage.setItem("graph-data-" + id, JSON.stringify({ nodes: [], edges: [] }));

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

    localStorage.setItem("graph-data-set", JSON.stringify(list));

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

    localStorage.setItem("graph-data-set", JSON.stringify(list.filter(it => it)));
    localStorage.removeItem("graph-data-" + data.id);

    return true;
  })

}


let graphService = new GraphService();
