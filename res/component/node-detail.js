Vue.component('node-detail', {
    template: `<div v-if="node" class="node-detail">
        <div>{{node.label}}</div>
        <div>分类：{{node.category}}</div>
        <div style="overflow:auto ">
            <pre>
                {{node.description}}
            </pre>
        </div>
    </div>`,
    props: {
        node: Object,
        x: Number,
        y: Number
    },
    methods: {

    }
})
