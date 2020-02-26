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
  return new Promise((resolve, reject) => {
    if (!data.name || data.name.trim().length === 0) {
      reject("请输入名称")
    } else {
      resolve(data)
    }
  })
}
GraphService.prototype.add = function (data) {
  return new Promise((resolve, reject) => {
    console.log(this)
    this.checkInput(data).then(this.getData).then((list) => {

      list.unshift({
        name: data.name,
        id: uuidv4(),
        create_at: new Date()
      })
      localStorage.setItem("graph-data-set", JSON.stringify(list));

      resolve();

    }).catch(err => reject(err))

  })
}

GraphService.prototype.update = function () {
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

let graphService = new GraphService();
