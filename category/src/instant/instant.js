(() => {
  function Instant(options, element) {
    this.options = {
      activityClass: 'activity-status'
    }
    this.element = $(element)
    $.extend(this.options, options)
    this.init()
  }

  Instant.prototype = new window.Raffle()

  Instant.prototype.extraEvent = function () {
    this.initInstant()
  }

  Instant.prototype.initInstant = function () {
    this.initModal()
    this.renderView()
  }

  /*
   * 重置功能
   * @method initReset
   * @param null
   * */
  Instant.prototype.initReset = function () {
    this.renderView()
  }

  Instant.prototype.renderView = function () {
    let message = this.limit()
    if (message) {
      this.utils.toast({
        msg: message
      })
      this.element.find('.instant-reward').html(message)
      this.element.find('.instant-title').html('')
      return false
    }
    this.drawModal((status, data) => {
      if (status > 0) {
        this.element.find('.instant-reward').html(data.title)
        this.element.find('.instant-title').html(data.reward)
      } else {
        this.element.find('.instant-reward').html(data)
      }
    })
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
