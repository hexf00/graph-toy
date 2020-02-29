var labelFill = {
    word: '#fdf72f',//黄色
    entity: '#9ba0ff',//蓝色
    class: '#ce621d',//橙色
}
//代码参考cn.vuejs.org/v2/examples/grid-component.html
var app = new Vue({
    router,
    el: '#app',
    computed: {
        currentEdgeSource: function () {
            if (this.currentType == "Edge") {
                return graph.findById(this.currentItem.source).getModel().label
            }
        },
        currentEdgeTarget() {
            if (this.currentType == "Edge") {
                return graph.findById(this.currentItem.target).getModel().label
            }
        },
        currentItemEdges() {
            if (this.currentType == "Node") {

                var data = graph.save();
                // return graph.findById(this.currentItem.target).getModel().label
                var result = data.edges.filter((edge) => {
                    const sourceId = edge.source;
                    const targetId = edge.target;

                    if (sourceId === this.currentItem.id || targetId === this.currentItem.id) {
                        return true
                        // graph.setItemState(targetId, 'selected', true);
                    }
                });

                result = JSON.parse(JSON.stringify(result));

                result = result.map(it => {
                    var source = graph.findById(it.source);
                    var target = graph.findById(it.target);
                    it.sourceModel = source.getModel();
                    it.targetModel = target.getModel();
                    return it;
                })

                return result;
            }


        },
        categories() {
            var categoriesMap = {};

            // 需要理解computed的原理，推测只要有JSON.stringify的调用就会强制调用，其它情况会根据引用决定
            //    console.log(JSON.stringify(  graph.save().nodes));

            this.graphData.nodes.forEach(it => {
                if (it.category) {
                    if (categoriesMap[it.category] === undefined) {
                        categoriesMap[it.category] = 1
                    } else {
                        categoriesMap[it.category]++
                    }
                } else {
                    var key = "none";
                    if (categoriesMap[key] === undefined) {
                        categoriesMap[key] = 1
                    } else {
                        categoriesMap[key]++
                    }
                }
            });

            var categories = [];
            for (var k in categoriesMap) {
                categories.push({
                    label: k,
                    count: categoriesMap[k]
                })
            }
            return categories;
        },
        listNodes: function () {
            // console.log("listNodes 更新", JSON.stringify(this.graphData.nodes))
            // var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()


            // var order = this.sortOrders[sortKey] || 1
            var nodes = this.graphData.nodes
            if (filterKey) {
                nodes = nodes.filter(function (row) {

                    // console.log(filterKey.)
                    var start = filterKey.indexOf("c:");
                    if (start !== -1) {
                        var filterVal = filterKey.slice(start + 2);

                        if (filterVal == "") {
                            return true //全部
                        } else if (filterVal == "none") {
                            return !row.category
                        } else {
                            return row.category && row.category.toLowerCase().indexOf(filterVal) > -1;
                        }
                    } else {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                        })
                    }
                })
            }
            // if (sortKey) {
            //     nodes = nodes.slice().sort(function (a, b) {
            //         a = a[sortKey]
            //         b = b[sortKey]
            //         return (a === b ? 0 : a > b ? 1 : -1) * order
            //     })
            // }
            return nodes
        },

    },
    methods: {
        changeEdgeVisible(model, status) {
            var edge = graph.find('edge', (edge) => {
                var { source, target } = edge.getModel();
                return source == model.source && target == model.target
            })
            graph.updateItem(edge, {
                visible: status,
            })

            if (status) {
                edge.show()
            } else {
                edge.hide()
            }

            graph.refreshItem(edge)
        },
        readerScroll: function (e) {
            localStorage.setItem('reader-scroll-top', e.target.scrollTop);
        },
        //将属性面板数据更新到图中
        updateItem: function () {

            if (this.currentType == "Node") {

                var item = graph.findById(this.currentItem.id);
                //item.update 不会触发g6事件 改为 graph.updateItem

                var updateModel = {
                    // id: this.currentItem.id,
                    type: this.currentItem.type, //节点类型
                    description: this.currentItem.description,
                    category: this.currentItem.category,
                    label: this.currentItem.label,
                };

                if (this.currentItem.type) {
                    updateModel.style = Object.assign({
                        fill: labelFill[this.currentItem.type]
                    }, updateModel.style)
                }

                //显示分类
                if (this.showCategoryStatus) {
                    updateModel.labelCfg = {
                        style: {
                            text: `[${updateModel.category}]${updateModel.label}`
                        }
                    }
                }

                graph.updateItem(item, updateModel)

                graph.refreshItem(item)
            } else {
                var item = graph.findById(this.currentItem.source);
                const edges = item.getOutEdges()

                edges.forEach(edge => {
                    if (edge.getModel().target == this.currentItem.target) {
                        edge.update({
                            // id: this.currentItem.id,
                            description: this.currentItem.description,
                            label: this.currentItem.label
                        });

                        graph.refreshItem(edge)
                    }

                })

            }

        },
        getSelection() {




        },
        createSelectedTextNode: function () {
            if (window.getSelection().toString() == "") {
                return;
            }
            const nodes = graph.findAllByState('node', 'selected');
            var id = new Date().getTime() + parseInt(Math.random() * 1000).toString();

            //因为需要手动指定x,y 无法调用布局方法
            var x = 0, y = 0;
            if (nodes.length) {
                x = nodes[0].getModel().x + 100;
                y = nodes[0].getModel().y;
            }
            graph.addItem('node', {
                id: id,
                realId: id,
                label: window.getSelection().toString(),
                x: x,
                y: y
            })

            if (nodes.length) {
                graph.addItem('edge', {
                    source: nodes[0].getModel().id,
                    target: id
                });
            }

            // 使用changeData也许要传递xy,如果不传递调用2次后
            //检测到有节点没有x\y 会导致重新布局 已有位置信息全部丢失

            //原文标注
            var html = $("#content").html();
            // html = html.replace(
            //     new RegExp(window.getSelection().toString(), 'g'),
            //     `<span class="highlight" data-id="${id}" onclick="app.focus(this)">${window.getSelection().toString()}</span>`
            // )

            html = mark(html,
                new RegExp(window.getSelection().toString(), 'g'),
                {
                    html: `<span class="highlight" data-id="${id}" onclick="app.focus(this)">${window.getSelection().toString()}</span>`,
                }
            );

            $("#content").html(html);

        },
        renderVisible() {
            //隐藏被隐藏的连线
            graph.getEdges().forEach((edge) => {
                if (edge.getModel().visible === false) {
                    edge.hide();
                }
            })

            graph.refresh();

        },
        renderReader() {
            //渲染标注文本
            var html = localStorage.getItem('reader-text');
            // console.log(html);
            var nodes = graph.save().nodes;

            nodes = nodes.sort((a, b) => {
                return b.label.length - a.label.length
            })

            for (var node of nodes) {
                var { id, label } = node;
                if (!label) {
                    continue;
                }
                try {

                    html = html.replace(
                        new RegExp(label.replace(/\*/g, "\\\*"), 'g'),
                        `<span class="highlight" data-id="${id}" onclick="app.focus(this)">${label}</span>`
                    )

                    //mark函数存在非常严重的bug

                    // html = mark(html,
                    //     new RegExp(label
                    //         // .replace(/\//g, "\\\/")
                    //         // .replace(/\@/g, "\\\@")
                    //         , 'g'),
                    //     {
                    //         html: `<span class="highlight" data-id="${id}" onclick="app.focus(this)">${label}</span>`,
                    //     }
                    // );
                } catch (error) {
                    console.error(error)
                }

            }

            this.contentHtml = html;

            //渲染后更新滚动条位置
            this.$nextTick(() => {

                $("#content").unbind("mouseover").unbind("mouseout")
                    .on("mouseover", "span", (e) => {
                        let nodeId = e.target.dataset.id
                        if (nodeId) {
                            let node = graph.findById(nodeId);
                            app.hoverNode = node.getModel();
                            app.hoverX = e.target.clientX;
                            app.hoverY = e.target.clientY;
                        }
                        // console.log("mouseover", e);
                    }).on("mouseout", "span", (e) => {
                        app.hoverNode = null;
                        app.hoverX = null;
                        app.hoverY = null;
                    })
                var scrollTop = localStorage.getItem('reader-scroll-top');
                if (scrollTop) {
                    this.$refs.readerContent.scrollTop = scrollTop
                }
            });

            // $("#content").html(html);

        },
        searchCategory(target) {
            this.leftTabActive = "节点";
            var { category } = target.dataset;
            this.filterKey = "c:" + category;
        },
        showCategory(status) {
            //是否显示分类。
            var data = graph.save()

            data.nodes.forEach((node) => {
                if (!node.labelCfg) {
                    node.labelCfg = {
                    }
                }
                if (!node.labelCfg.style) {
                    node.labelCfg.style = {
                    }
                }
                if (status) {
                    if (node.category) {
                        node.labelCfg.style.text = `[${node.category}]${node.label}` //rect
                    } else {
                        delete node.labelCfg.style.text
                    }
                } else {
                    delete node.labelCfg.style.text
                }
            })

            this.showCategoryStatus = status

            graph.changeData(data)
        },
        focusItem: function (data) {
            app.currentType = data.type;
            app.currentItem = data.data;
        },
        focus: function (target) {
            console.log(target, this);

            //参考g6.antv.vision/zh/examples/interaction/position
            var { id } = target.dataset;

            var item = graph.findById(id);

            const selectedNodes = graph.findAllByState('node', 'selected');
            selectedNodes.forEach(cn => {
                graph.setItemState(cn, 'selected', false);
            });


            graph.setItemState(item, 'selected', true);

            this.currentType = "Node";
            this.currentItem = item.getModel();
            // const item = event.item;
            // 聚焦当前点击的节点（把节点放到视口中心）

            const matrix = item.get('group').getMatrix();
            const point = {
                x: matrix[6],
                y: matrix[7]
            };
            const width = graph.get('width');
            const height = graph.get('height');
            // 找到视口中心
            const viewCenter = {
                x: width / 2,
                y: height / 2
            };
            const modelCenter = graph.getPointByCanvas(viewCenter.x, viewCenter.y);
            const viewportMatrix = graph.get('group').getMatrix();
            // 画布平移的目标位置，最终目标是graph.translate(dx, dy);
            const dx = (modelCenter.x - point.x) * viewportMatrix[0];
            const dy = (modelCenter.y - point.y) * viewportMatrix[4];
            let lastX = 0;
            let lastY = 0;
            let newX = void 0;
            let newY = void 0;
            // 动画每次平移一点，直到目标位置
            graph.get('canvas').animate({
                onFrame: function onFrame(ratio) {
                    newX = dx * ratio;
                    newY = dy * ratio;
                    graph.translate(newX - lastX, newY - lastY);
                    lastX = newX;
                    lastY = newY;
                }
            }, 300, 'easeCubic');

            console.log(this, id)
        },
        renderTypeStyle() {
            var data = graph.save()
            data.nodes = data.nodes.map((node) => {
                if (node.type) {
                    node.style = Object.assign({}, node.style, {
                        fill: labelFill[node.type]
                    })
                }
                return node
            })

            graph.changeData(data);
        },
    },
    created() {
        this.renderTypeStyle();//渲染Type颜色
        this.renderVisible();
        this.renderReader();
        eventSquare.addVue(this)
    },
    data: {
        contentHtml: '',
        currentType: '', //Node、Edge
        currentItem: {},
        leftTabActive: "节点", //leftTab默认激活选项卡
        rightTabActve: "属性",//rightTab默认激活选项卡
        hoverNode: null,//阅读器悬浮节点
        hoverX: 0,
        hoverY: 0,
        showReader: true,
        showSearch: true,
        showAttr: true,
        showCategoryStatus: false, //label显示分类
        filterKey: "",
        saveTime: "", //自动保存时间
        graphData: graph.save(),
        saveManager: saveManager,

        // nodes: graph.save().nodes,
    }
})
