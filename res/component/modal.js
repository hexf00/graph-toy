Vue.component('modal', {
  template: /*html*/`
    <div v-if="show" class="modal-bg">
      <div class="modal">
        <div class="modal-title">
          <span>{{title}}</span>
          <a class="close" @click="close">×</a>
        </div>
        <div class="modal-content">
          <slot @done="this.$emit('done')" @cancel="this.$emit('cancel')"></slot>
        </div>
        <div v-if="showFooter" class="modal-footer">
          <button @click="onDone" >确认</button>
          <button @click="close" >取消</button>
        </div>
      </div>
    </div>
  `,
  props: {
    showFooter: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
  },
  data() {
    return {
      title: "",
      show: false
    }
  },
  methods: {
    open(title) {
      this.title = title ? title : ""
      this.show = true
    },
    close() {
      this.show = false
      this.$emit('cancel')
    },
    onDone() {
      this.$emit('done')
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
})  
