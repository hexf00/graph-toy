Vue.component('tab', {
    template: /*html*/`
    <div>
        <ul class="tab-title">
            <li v-for="title in panelTitles" @click="active_c=title" :class="{active:active_c == title}">{{title}}</li>
        </ul>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
    `,
    model: {
        prop: 'active',
        event: 'input'
    },
    props: {
        active: String,
    },
    computed: {
        active_c: {
            get() {
                return this.active;
            },
            set(val) {
                this.$emit("update:active", val);
                this.$emit("input", val);
            }
        }
    },
    data() {
        return {
            panelTitles: [],
        }
    },
    methods: {
        calcPaneInstances() {
            if (this.$slots.default) {
                const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
                    vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'panel');

                this.panelTitles = paneSlots.map(({ componentInstance }) => {
                    return componentInstance.title
                });
            }
        }
    },
    mounted() {
        this.calcPaneInstances();
    }
})  
