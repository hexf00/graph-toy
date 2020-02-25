// 不适宜添加focus操作，因为中心被遮挡，且会改变已选中的逻辑
Vue.component('set-category', {
    template: /*html*/`<div style="display:inline-block;">
        <button @click="showTextEdit">设置分类</button>
        <div v-show="showTextEditStatus" style="
        position: fixed;
        z-index: 99999999999;
        border: 1px solid #ff0;
        background: #ddd;
        padding: 20px;
        left: calc( 50% - 200px );
        width: 400px;">
            <strong>为选中节点设置分类</strong>
            <ul style="padding: 0;list-style: none;">
                <li v-for="node in nodes" :title="node.getModel().label" >
                    <span style="
                    width:300px;
                    display:inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;">
                        {{node.getModel().label}}
                    </span>
                     -- {{node.getModel().category}}
                </li>
            </ul>
            <div>
                分类名：<input v-model="category" type="text">
            </div>
            <div>
                <button @click="setCategory">保存</button>
                <button @click="hideTextEdit">取消</button>
            </div>
        </div>
    </div>`,
    data() {
        return {
            showTextEditStatus: false,
            nodes: [],
            category: ""
        }
    },
    methods: {
        showTextEdit() {

            this.nodes = graph.findAllByState('node', 'selected');
            if (this.nodes.length == 0) {
                alert("未选中节点");
                return;
            }

            this.showTextEditStatus = true;
            this.category = "";

        },
        hideTextEdit() {
            this.showTextEditStatus = false;
        },
        setCategory() {
            var category = this.category.trim();

            if (category.length == 0) {
                alert("请输入分类");
                return;
            }

            this.nodes.forEach((node) => {
                graph.updateItem(node, {
                    category
                })
            })

            this.showTextEditStatus = false;
        }
    }
})
