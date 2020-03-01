function Notify() {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "1500",
    "extendedTimeOut": "500",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
}
Notify.prototype.success = function () {
  toastr.success(...arguments)
}
Notify.prototype.info = function () {
  toastr.info(...arguments)
}
Notify.prototype.warning = function () {
  toastr.warning(...arguments)
}
Notify.prototype.error = function () {
  toastr.error(...arguments)
}
var notify = new Notify()
