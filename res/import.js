
var importData = function (el) {

    var file = el.files[0];

    console.log(file.type);
    if (!/application\/json/.test(file.type)) {
        alert("文件格式错误！");
        return false;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        //更新数据
        graph.changeData(JSON.parse(this.result));
    }
}


var importArticle = function (el) {
    var file = el.files[0];

    if (!/text\/html/.test(file.type)) {
        alert("文件格式错误！");
        return false;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        localStorage.setItem('reader-text', this.result);
        app.rerenderReader();
    }
}