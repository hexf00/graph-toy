//光标最后 cnblogs.com/ybixian/p/10601224.html
function keepLastIndex(obj) {
    // console.log(obj)
    // console.log(window.getSelection)
    // console.log(document.selection)
    if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
    } else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
    }
}


//双击空白新建节点
G6.registerBehavior('node-dblclick-edit', {
    getEvents() {
        return {
            'node:dblclick': 'onDblClick',
        };
    },
    onDblClick(e) {
        e.preventDefault();
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        const { item } = e;
        window.a = item;
        const graph = this.graph;

        const model = item.getModel();






        const zoom = graph.getZoom();

        //下面代码参考 github.com/alibaba/GGEditor/tree/master/src/plugins/EditableLabel


        const group = item.getContainer();
        const labelShape = group.findByClassName('node-label');

        const { x: relativeX, y: relativeY } = labelShape.getBBox();
        const { x: absoluteX, y: absoluteY } = G6.Util.applyMatrix(
            {
                x: relativeX,
                y: relativeY,
            },
            item.getContainer().getMatrix(),
        );

        const { x: left, y: top } = graph.getCanvasByPoint(absoluteX, absoluteY);
        const { width, height } = labelShape.getBBox();


        $(`#focus-input`)
            .css('left', left)
            .css('top', top)
            .css('minWidth', width)
            .css('minHeight', height)
            .css('background', '#fff')
            .css('font-size', labelShape.attr('fontStyle'))
            .css('font-variant', labelShape.attr('fontVariant'))
            .css('font-weight', labelShape.attr('fontWeight'))
            .css('font-size', labelShape.attr('fontSize'))
            .css('font-family', labelShape.attr('fontFamily'))
            .css('transform', `scale(${zoom})`)
            .css('transformOrigin', 'left top')
            .html(model.label)
            .attr('contenteditable', 'true')
            .show()
            .focus()
            .on("input", function () {
                //记录长度变化
            })
            .on("blur", function () {
                //失去焦点事件

                // console.log(model.realId);
                const findNodes = graph.findAll('node', node => {
                    return node.get('model').realId === model.realId;
                });

                findNodes.forEach(node => {
                    graph.updateItem(node, {
                        label: $(this).text(),
                        // size: [$(this).width() + 40, $(this).height() + 20]
                    })
                });



                $(this).hide().unbind();
            });
        keepLastIndex($(`#focus-input`)[0]);

    },
});

