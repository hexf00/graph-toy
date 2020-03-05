// 自动保存

// 1. 更新最新数据到localStorage
// 2. 触发exportData导出函数
//    修改状态 x 分钟后自动保存，修改不会导致重新即使，保存会导致重新计时
//    修改数据 x 条后自动保存，保存后重新计数

// 用户关注的是： 不是什么时候保存过，而是当前状态有没有修改，修改了多少。
// 用户关注什么我们就告诉用户什么。

//保存管理器
var SaveManager = function ({ dataLayer, localStorageKey, graphName }) {
    this.dataLayer = dataLayer

    this.localStorageKey = localStorageKey
    this.graphName = graphName

    this.exportStatus = true
    this.changeCount = 0
    this.timer = null //修改后的导出倒计时
    this.autoExportChangeCount = 50 //达到50条记录改变时则自动导出

    this.dataLayer.on("batch", _.throttle(() => this.saveToLocalStorage(), 100, {
        leading: false,
        trailing: true //节流结束后执行
    })).on("batch", commands => {
        this.exportStatus = false
        this.changeCount += commands.length

        if (this.changeCount >= this.autoExportChangeCount) {
            this.exportData()
        } else {
            //延时导出 1分钟自动导出一次
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.exportData()
                }, 60 * 1000)
            }
        }
    })
}

SaveManager.prototype.saveToLocalStorage = function () {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.dataLayer.data))
}

SaveManager.prototype.download = function (filename, data) {
    var file = "data:text/plain;charset=utf-8,";
    var encoded = encodeURIComponent(data);
    file += encoded;
    var a = document.createElement('a');
    a.href = file;
    a.target = '_blank';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

SaveManager.prototype.exportData = function () {
    var filename = this.graphName + ".export.json";
    // if (data.nodes.length > 0) {
    //     filename = data.nodes[0].label + ".export.json";
    // }
    this.download(filename, JSON.stringify(this.dataLayer.data, null, 2))
    console.log("导出记录", filename, new Date());

    //重置状态
    this.exportStatus = true
    this.changeCount = 0
    if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
    }
}

SaveManager.prototype.importData = function (e) {
    var file = e.target.files[0];

    if (!/application\/json/.test(file.type)) {
        alert("文件格式错误！");
        return false;
    }
    var that = this
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        //更新数据
        that.dataLayer.changeData(JSON.parse(this.result))
        that.saveToLocalStorage()
    }
}


SaveManager.prototype.destroy = function () {
    //销毁定时器
    if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
    }
}
