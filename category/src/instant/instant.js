(() => {
  function Instant(options) {
    this.options = {
      activityClass: 'activity-status'
    }
    $.extend(this.options, options)
    this.init()
  }

  Instant.prototype = new window.Raffle()

  Instant.prototype.extraEvent = function () {
    this.initInstant()
  }

  Instant.prototype.initInstant = function () {
    this.drawModal()
  }

  /*
  * 插件封装
  */
  $.fn.instant = function (options) {
    let args = Array.prototype.slice.call(arguments, 1)
    return this.each(() => {
      let instance = $(this).data('instant')
      if (instance) {
				instance[options].apply(instance, args)
			} else {
				instance = $(this).data('instant', new Instant(options, this))
			}
    })
	}
})()
