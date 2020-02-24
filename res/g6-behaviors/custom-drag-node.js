
//代码参考github.com/antvis/G6/blob/master/src/behavior/drag-node.js
// /antvis/G6/blob/master/src/behavior/drag-node-with-group.js

//在原基础实现节点判断
G6.registerBehavior('custom-drag-node', {
    targetId: null,

    updateEdge: true, //更新边
    enableDelegate: true, //显示框框，即延时绘制拖拽结果
    delegateStyle: {
        fill: '#F3F9FF',
        fillOpacity: 0.5,
        stroke: '#1890FF',
        strokeOpacity: 0.9,
        lineDash: [5, 5]
    },
    //原始坐标
    getEvents() {
        return {
            //dragstart mousedown可能存在bug
            'node:dragstart': 'onDragStart',
            'node:drag': 'onDrag',
            'node:dragend': 'onDragEnd',
            mouseenter: 'onMouseEnter',
            mouseleave: 'onMouseLeave'
        };
    },

    onMouseEnter(e) {
        if (e.target.get('parent')) {
            this.targetId = e.target.get('parent').get('id');
            // console.log('onMouseEnter', e.target.get('parent').get('id'))
        }

    },

    onMouseLeave(e) {
        if (e.target.get('parent')) {

            this.targetId = null;
            // console.log('onMouseEnter'
            //     , e.target.get('parent').get('id')
            //     , this.graph.findById(e.target.get('parent').get('id')).getModel()

            // )
        }

    },
    onDragStart(e) {



        if (!this.shouldBegin.call(this, e)) {
            return;
        }

        const { item, target } = e;
        const hasLocked = item.hasLocked();
        if (hasLocked) {
            return;
        }

        // 如果拖动的target 是linkPoints / anchorPoints 则不允许拖动
        if (target) {
            const isAnchorPoint = target.get('isAnchorPoint');
            if (isAnchorPoint) {
                return;
            }
        }

        const graph = this.graph;

        this.targets = [];

        // 获取所有选中的元素
        const nodes = graph.findAllByState('node', 'selected');

        const currentNodeId = item.get('id');

        // 当前拖动的节点是否是选中的节点
        const dragNodes = nodes.filter(node => {
            const nodeId = node.get('id');
            return currentNodeId === nodeId;
        });

        // 只拖动当前节点
        if (dragNodes.length === 0) {
            this.target = item;
        } else {
            // 拖动多个节点
            if (nodes.length > 1) {
                nodes.forEach(node => {
                    const hasLocked = node.hasLocked();
                    if (!hasLocked) {
                        this.targets.push(node);
                    }
                });
            } else {
                this.targets.push(item);
            }
        }

        this.origin = {
            x: e.x,
            y: e.y
        };

        this.point = {};
        this.originPoint = {};
    },
    onDrag(e) {

        // if (e) {

        //     console.log(this.targetId)
        // }
        e.target.set('capture', false);


        if (!this.origin) {
            return;
        }
        if (!this.get('shouldUpdate').call(this, e)) {
            return;
        }
        const graph = this.graph;
        const autoPaint = graph.get('autoPaint');
        graph.setAutoPaint(false);


        // 只处理拖拽过程中的绘图
        // 当targets中元素时，则说明拖动的是多个选中的元素
        if (this.targets.length > 0) {
            if (this.enableDelegate) {
                this._updateDelegate(e);
            } else {
                this.targets.forEach(target => {
                    this._update(target, e, this.enableDelegate);
                });
            }
        } else {
            // 只拖动单个元素
            this._update(this.target, e, this.enableDelegate);
        }

        graph.paint();
        graph.setAutoPaint(autoPaint);
    },
    onDragEnd(e) {

        // console.log(this.targetId, this.targetId && this.graph.findById(this.targetId).getModel());
        if (!this.origin || !this.shouldEnd.call(this, e)) {
            return;
        }


        const graph = this.graph;
        const autoPaint = graph.get('autoPaint');
        graph.setAutoPaint(false);

        if (this.shape) {
            this.shape.remove();
            this.shape = null;
        }

        if (this.target) {
            const delegateShape = this.target.get('delegateShape');
            if (delegateShape) {
                delegateShape.remove();
                this.target.set('delegateShape', null);
            }
        }



        //上面代码是用来改变位置的
        //如果是建立关联，我们是不需要改变位置的

        // console.log(this.targetId, this.targets, this.target)
        //this.targetId 松开鼠标时的节点ID，在鼠标事件中获取
        //this.targets 选中节点，即拖拽的拖个节点
        //this.target 没有选中节点时，松开鼠标时的节点，即拖拽的单个节点，在开始拖拽事件获取

        // this.targets 和 this.target是二选一模式

        let dragNodes = []
        if (this.targets.length > 0) {
            //多选情况，获取所有已经选中的节点，排除了锁定的节点
            dragNodes = this.targets
        } else if (this.target) {
            //未选中情况，开始拖拽时光标处的节点
            dragNodes = [this.target]
        }

        if (this.targetId) {
            //希望建立连线

            var findEdge = (model) => {
                return graph.find('edge', (edge) => {
                    var { source, target } = edge.getModel();
                    return source == model.source && target == model.target
                })
            }

            //创建
            var addEdgeUnique = (model) => {
                if (!findEdge(model)) {
                    graph.addItem('edge', {
                        source: model.source,
                        target: model.target
                    })
                }
            }


            if (this.targets.length > 0) {
                //有选中节点时


                //如果目标ID是已经选择的目标则放弃此次操作
                if (!this.targets.find(node => node.getModel().id == this.targetId)) {
                    this.targets.forEach(node => {
                        addEdgeUnique({
                            source: node.getModel().id,
                            target: this.targetId
                        });
                    });
                }




            } else if (this.target) {
                //无选中节点

                //避免自连接
                if (this.target.getModel().id != this.targetId) {


                    addEdgeUnique({
                        source: this.target.getModel().id,
                        target: this.targetId
                    });
                }
            }


        } else {
            //希望移动
            if (graph.get('dataLayer')) {
                if (dragNodes.length) {
                    let commands = dragNodes.map(node => {
                        return {
                            type: "node",
                            action: "update",
                            id: node.getModel().id,
                            model: this.calcPos(node, e)
                        }
                    });
                    graph.get('dataLayer').batch(commands).catch((err) => {
                        console.error("g6 移动选中节点 时出错")
                    })
                }
            } else {
                dragNodes.forEach(node => this._update(node, e))
            }
        }



        this.point = {};
        this.origin = null;
        this.originPoint = {};
        this.targets.length = 0;
        this.target = null;

        // 终止时需要判断此时是否在监听画布外的 mouseup 事件，若有则解绑
        const fn = this.fn;
        if (fn) {
            body.removeEventListener('mouseup', fn, false);
            this.fn = null;
        }

        graph.paint();
        graph.setAutoPaint(autoPaint);
    },
    //计算节点的新位置，仅限非实时拖拽的情况
    calcPos(item, e) {
        const origin = this.origin;
        const model = item.get('model');
        const x = e.x - origin.x + model.x;
        const y = e.y - origin.y + model.y;
        return { x, y }
    },
    //force 即 this.enableDelegate的值
    _update(item, e, force) {


        const origin = this.origin;
        const model = item.get('model');
        const nodeId = item.get('id');
        if (!this.point[nodeId]) {
            // 需要缓存节点的原始位置，不然节点位置改变后（实时更新的情况），后面无法参与计算
            this.point[nodeId] = {
                x: model.x,
                y: model.y
            };
        }

        const x = e.x - origin.x + this.point[nodeId].x;
        const y = e.y - origin.y + this.point[nodeId].y;

        // 拖动单个未选中元素，仅仅在拖拽过程中调用，主要目的是更新框框的位置
        if (force) {
            this._updateDelegate(e, x, y);
            return;
        }

        const pos = { x, y };

        //是否更新边

        if (this.get('updateEdge')) {
            this.graph.updateItem(item, pos);
        } else {
            item.updatePosition(pos);
            // this.graph.paint();
        }
    },
    /**
     * 更新拖动元素时的delegate
     * @param {Event} e 事件句柄
     * @param {number} x 拖动单个元素时候的x坐标
     * @param {number} y 拖动单个元素时候的y坐标
     */
    _updateDelegate(e, x, y) {
        const bbox = e.item.get('keyShape').getBBox();
        if (!this.shape) {
            // 拖动多个
            const parent = this.graph.get('group');
            const attrs = Object.assign({}, this.delegateStyle);
            if (this.targets.length > 0) {
                const { x, y, width, height, minX, minY } = this.calculationGroupPosition();
                this.originPoint = { x, y, width, height, minX, minY };
                // model上的x, y是相对于图形中心的，delegateShape是g实例，x,y是绝对坐标
                this.shape = parent.addShape('rect', {
                    attrs: {
                        width,
                        height,
                        x,
                        y,
                        ...attrs
                    }
                });
            } else if (this.target) {
                this.shape = parent.addShape('rect', {
                    attrs: {
                        width: bbox.width,
                        height: bbox.height,
                        x: x + bbox.x,
                        y: y + bbox.y,
                        ...attrs
                    }
                });
                this.target.set('delegateShape', this.shape);
            }
            this.shape.set('capture', false);
        } else {
            if (this.targets.length > 0) {
                const clientX = e.x - this.origin.x + this.originPoint.minX;
                const clientY = e.y - this.origin.y + this.originPoint.minY;
                this.shape.attr({
                    x: clientX,
                    y: clientY
                });
            } else if (this.target) {
                this.shape.attr({
                    x: x + bbox.x,
                    y: y + bbox.y
                });
            }
        }

        // this.graph.paint();
    },
    /**
    * 计算delegate位置，包括左上角左边及宽度和高度
    * @memberof ItemGroup
    * @return {object} 计算出来的delegate坐标信息及宽高
    */
    calculationGroupPosition() {
        const graph = this.graph;

        const nodes = graph.findAllByState('node', 'selected');

        let minx = Infinity;
        let maxx = -Infinity;
        let miny = Infinity;
        let maxy = -Infinity;

        // 获取已节点的所有最大最小x y值
        for (const id of nodes) {
            // console.log("------------",id, typeof id);
            const element = typeof id === 'string' ? graph.findById(id) : id;
            const bbox = element.getBBox();
            const { minX, minY, maxX, maxY } = bbox;
            if (minX < minx) {
                minx = minX;
            }

            if (minY < miny) {
                miny = minY;
            }

            if (maxX > maxx) {
                maxx = maxX;
            }

            if (maxY > maxy) {
                maxy = maxY;
            }
        }
        const x = Math.floor(minx) - 20;
        const y = Math.floor(miny) + 10;
        const width = Math.ceil(maxx) - x;
        const height = Math.ceil(maxy) - y;

        return {
            x,
            y,
            width,
            height,
            minX: minx,
            minY: miny
        };
    }
});
