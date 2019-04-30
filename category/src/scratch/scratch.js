((window) => {
  // 刮刮卡业务逻辑处理
  function Scratch(options) {
    this.options = {
      activityClass: 'activity-status'
    }
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
    // this.initModal(() => {
    //   // this.drawModal()
    // })
    // return false
    this.initEraser()
  }

  /*
   * 实例化擦拭功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  Scratch.prototype.initEraser = function () {
    $('.scratch-canvas').eraser({
      progressFunction: (progress) => {
        let progressData = Math.round(progress * 100)
        if (progressData > 18) {
          $('.scratch-canvas').eraser('clear')
          this.drawModal()
          $('.raffle-reset').addClass(this.options.activityClass)
        } else if (progressData < 5) {
          this.initModal()
        }
      }
    })
  }

  /*
   * 重置擦拭功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  Scratch.prototype.initReset = function () {
    $('.scratch-canvas').eraser('reset')
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
