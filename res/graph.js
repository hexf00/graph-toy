//载入缓存

var data = { "nodes": [], "edges": [] }
try {
    var rawData = localStorage.getItem("auto-save-data");
    if (rawData) {
        data = JSON.parse(rawData);
    }
} catch (e) {
    console.error(e);
}






// 使用数据层确保数据的唯一准确性
var dataLayer = new DataLayer(data);
var eventSquare = new EventSquare(dataLayer);
var saveManager = new SaveManager({
    dataLayer,
    localStorageKey: "auto-save-data",
    graphName: "默认图"
});

// g6操作通知数据层进行数据层数据更新，更新成功后通知g6进行数据更新
// 考虑到性能，需要将多个操作一起打包
// 多个操作打包需要考虑到中途可能失败，需要事务失败需要进行回滚，更合理的选择应该是使用数据库

// 数据层通知g6进行数据更新，一个画布一个监听器实例
// 直接调用g6进行绘制即可
// var g6Scheduler = new Scheduler();


// 不需要对每一个g6实例都建立一个事件监听，虽然也可也把g6理解为事件消费者：数据层告诉g6更新什么数据
// 如果说存在多个g6实例，展示了不同的数据（都是部分），由数据层告诉g6更新什么数据，g6就是数据消费者
// 那么将g6实例注册绑定到数据层就是有必要的了
// 数据层这个词比较抽象，不过数据层依然是没有操作各个g6实例的必要，也没有管理的必要
// 完全可以在外部建立一个管理的工具，事件机制已经提供实现这个功能必要的基础
// 数据层只做数据层数据的维护，数据变动的通知。。 至于这些数据是拿去更新其它g6实例还是别的，并没有那么重要


const graph = new G6.Graph({
    container: 'mountNode',  // String | HTMLElement，必须，容器 id 或容器本身
    width: Math.floor($('#mountNode').width()),              // Number，必须，图的宽度
    height: Math.floor($('#mountNode').height()),             // Number，必须，图的高度
    // renderer: "svg",
    modes: {
        default: [
            'dblclick-new',
            'shortcut-keys',
            'brush-select',
            'custom-drag-node',
            'item-click',
            'drag-canvas',
            'zoom-canvas',
            'item-hover',
            // 边提示框交互工具的配置
            {
                type: 'edge-tooltip',
                formatText(model) {
                    var target = this.graph.findById(model.target).getModel();
                    var source = this.graph.findById(model.source).getModel();

                    const text = `${source.label} ==${model.label || ""}==> ${target.label}`;
                    return text;
                },
                shouldUpdate: e => {
                    return true;
                }
            }
        ]
    },
    defaultEdge: {
        style: {
            endArrow: true,
            lineWidth: 2
        }
    },
    nodeStateStyles: {
        selected: {
            // hover 状态为 true 时的样式
            fill: '#d3adf7',
        },
    },
    // layout: {
    //     type: 'force',            // 设置布局算法为 force
    //     linkDistance: 150,        // 设置边长为 100
    //     preventOverlap: true,     // 设置防止重叠
    //     nodeSize: 60,
    //     nodeStrength: 10,
    //     edgeStrength: 3,
    // },  

    // 边在各状态下的样式
    edgeStateStyles: {
        hover: {
            stroke: '#f00'
        },
        // click 状态为 true 时的样式
        selected: {
            stroke: '#f00'
        }
    },
    dataLayer: dataLayer, //绑定数据层实例
    eventSquare, //绑定事件广场
    animate: true            // Boolean，可选，切换布局时是否使用动画过度
});

//注册数据消费者实例到事件广场
eventSquare.addGraph(graph)

//参考antv-2018.alipay.com/zh-cn/g6/3.x/demo/tool/context-menu.html
graph.on('node:contextmenu', function (evt) {
    console.log();
    $('.menu').css('left', evt.clientX).css('top', evt.clientY).show();


    //设置ID 便于后续操作
    $('.menu a').data('id', evt.item.getModel().id);
});

graph.on('node:mouseleave', function (evt) {
    $('.menu').hide();
});


// 不能让g6实例污染数据层的数据
var g6Data = JSON.parse(JSON.stringify(dataLayer.data));
// 对G6数据添加预处理
g6Data.edges.forEach((edge) => {
    edge.style = {
        endArrow: true,
        lineWidth: 2
    }
})

graph.data(g6Data);
graph.render();