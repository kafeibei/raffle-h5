((window) => {
  // 摇一摇业务逻辑处理
  function iShake(options, element) {
    this.options = {
      activityClass: 'activity-status',
      shakeClass: 'shake-animation',
      shakeMp3: '../../common/audio/shake.mp3',
      coinMp3: '../../common/audio/coin.mp3'
    }
    this.element = $(element)
    $.extend(this.options, options)
    this.init()
  }

  iShake.prototype = new window.Raffle()

  /*
   * 重置抽奖状态
   * @method extraEvent 绑定事件钩子
   * @param null
   * */
  iShake.prototype.extraEvent = function () {
    this.initModal()
    this.initShake()
  }

  iShake.prototype.initAudio = function () {
    this.shakeAudio = new Audio()
    this.shakeAudio.src = this.options.shakeMp3
    // this.shakeAudio.loop = true
  }

  /*
   * 实例化摇一摇功能
   * @method initShake 绑定事件钩子
   * @param null
   * */
  iShake.prototype.initShake = function () {
    this.initAudio()
    this.shakeEvent = new Shake({
      threshold: 15,
      timeout: 1000
    })
    this.shakeEvent.start()
    window.addEventListener('shake', () => {
      this.shakeEventDidOccur()
    }, false)
  }

  iShake.prototype.shakeEventDidOccur = function () {
    this.shakeAudio.play()
    setTimeout(() => {
      this.shakeAudio.pause()
      this.shakeAudio.src = this.options.coinMp3
      // this.shakeAudio.loop = false
      this.shakeAudio.play()
      this.drawModal((status, data) => {
        if (status > 0) {
          this.element.find('.shake-area').removeClass(this.options.shakeClass)
          this.element.find('.raffle-reset').addClass(this.options.activityClass)
        } else {
          this.utils.toast({
            msg: data
          })
        }
      })
    }, 1000)
  }

  /*
   * 重置擦拭功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  iShake.prototype.initReset = function () {
    let message = this.limit()
    if (message) {
      this.utils.toast({
        msg: message
      })
      return false
    }
		this.element.find('.raffle-reset').removeClass(this.options.activityClass)
    this.element.find('.shake-area').addClass(this.options.shakeClass)
  }

  /*
  * 插件封装
  */
  $.fn.iShare = function (options) {
    let args = Array.prototype.slice.call(arguments, 1)
    return this.each(() => {
      let instance = $(this).data('ishake')
      if (instance) {
				instance[options].apply(instance, args)
			} else {
				instance = $(this).data('ishake', new iShake(options, this))
			}
    })
	}
})(window)
