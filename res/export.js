var download = function (filename, data) {
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

var exportData = function () {

    var data = graph.save()

    data.nodes.forEach((item,i)=>{
        delete data.nodes[i].labelCfg
    })

    var filename = "graph-toy.export.json";
    if (data.nodes.length > 0) {
        filename = data.nodes[0].label + ".export.json";
    }

    download(filename, JSON.stringify(data));
}
