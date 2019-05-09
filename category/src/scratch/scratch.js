((window) => {
  // 刮刮卡业务逻辑处理
  function Scratch(options, element) {
    this.options = {
      activityClass: 'activity-status'
    }
    this.element = $(element)
    $.extend(this.options, options)
    this.init()
  }

  Scratch.prototype = new window.Raffle()

  /*
   * 重置抽奖状态
   * @method extraEvent 绑定事件钩子
   * @param null
   * */
  Scratch.prototype.extraEvent = function () {
    this.initModal()
    this.initEraser()
    let plat = window.utils.mobileDevice()
    let ltype = (plat == 'Other') ? 'click' : 'touchstart'
    this.element
       .on(ltype, '.img-up', $.proxy( this._scratchLimit, this))	// 关闭弹框
  }

  /*
   * 实例化擦拭功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  Scratch.prototype.initEraser = function () {
    let message = this.limit()
    if (message) {
      return false
    }
    $('.scratch-canvas').eraser({
      progressFunction: (progress) => {
        let progressData = Math.round(progress * 100)
        if (progressData > 18) {
          $('.scratch-canvas').eraser('clear')
          this.drawModal()
          $('.raffle-reset').addClass(this.options.activityClass)
        }
      }
    })
  }

  Scratch.prototype._scratchLimit = function (event) {
    let message = this.limit()
    if (message) {
      this.utils.toast({
        msg: message
      })
    }
  }

  /*
   * 重置擦拭功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  Scratch.prototype.initReset = function () {
    let message = this.limit()
    if (message) {
      this.utils.toast({
        msg: message
      })
      this.element.find('.scratch-canvas').eraser('disable')
    }
    this.element.find('.scratch-canvas').eraser('reset')
		$('.raffle-reset').removeClass(this.options.activityClass)
  }

  /*
  * 插件封装
  */
  $.fn.scratch = function (options) {
    let args = Array.prototype.slice.call(arguments, 1)
    return this.each(() => {
      let instance = $(this).data('scratch')
      if (instance) {
				instance[options].apply(instance, args)
			} else {
				instance = $(this).data('scratch', new Scratch(options, this))
			}
    })
	}
})(window)
