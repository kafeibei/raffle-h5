((window) => {
  // 老虎机业务逻辑处理
  function Slot(options, element) {
    this.options = {
      activityClass: 'activity-status',
      grid: 3,
      box_tpl : ''+
      	'<div class="slot-box">' +
          '<img title="{{liv_title}}" src="{{liv_pic}}" />' +
        '</div>' +
        '',
      machine_tpl: '' +
        '<div id="slot-{{liv_index}}" class="slot-machine">{{liv_box_li}}</div>' +
        ''
    }
    this.element = $(element)
    this.resultInfo = {}
    $.extend(this.options, options)
    this.init()
  }

  Slot.prototype = new window.Raffle()

  /*
   * 重置抽奖状态
   * @method extraEvent 绑定事件钩子
   * @param null
   * */
  Slot.prototype.extraEvent = function () {
    this.initModal()
    this.initSlot()
  }

  /*
   * 实例化老虎机功能
   * @method initSlot 绑定事件钩子
   * @param null
   * */
  Slot.prototype.initSlot = function () {
    this.renderSlot()
    this.mSlot = {}
    let _this = this
    for (let i=0; i<this.options.grid; i++) {
      this.mSlot[i+1] = new SlotMachine($('#slot-' + (i + 1))[0], {
        active: i,
        delay: 500,
        randomize () {
          if (_this.options.data && _this.options.data.rewards) {
            let len = _this.options.data.rewards.length
            let random = Math.floor(Math.random() * (len + 1))
            if (_this.resultInfo.status > 0) {
              return _this.resultInfo.redeemable ? _this.resultInfo.num : random
            }
          }
          return 1
        }
      })
    }
  }

  Slot.prototype.renderSlot = function () {
    if (this.options.data && this.options.data.rewards) {
      let box_li= ''
      this.options.data.rewards.forEach((item) => {
        box_li += this.options.box_tpl.replace(/{{liv_(.*?)}}/g, (string, key) => {
          return string.replace('{{liv_' + key + '}}', item[key] || '')
        })
      })
      let machine_tpl = ''
      for (let i=0; i<this.options.grid; i++) {
        machine_tpl += this.options.machine_tpl.replace(/{{liv_(.*?)}}/g, (string, key) => {
          if (key === 'box_li') {
            return string.replace('{{liv_box_li}}', box_li)
          } else if (key === 'index') {
            return string.replace('{{liv_index}}', i+1)
          }
          return string
        })
      }
      this.element.find('.slot-area').removeClass('hide').append(machine_tpl)
    }
  }

  /*
   * 重置功能
   * @method initEraser 绑定事件钩子
   * @param null
   * */
  Slot.prototype.initReset = function () {
    let message = this.limit()
    if (message) {
      this.utils.toast({
        msg: message
      })
      return false
    }
    this.lotteryModal((status, data) => {
      this.resultInfo.status = status
      if (status > 0) {
        this.resultInfo = $.extend(this.resultInfo, data)
      } else {
        this.utils.toast({
          msg: data
        })
      }
    })
		this.element.find('.raffle-reset').removeClass(this.options.activityClass)
    for (let i=0; i<this.options.grid; i++) {
      setTimeout(() => {
        this.mSlot[i+1].shuffle(5, (active) => {
          if (i === this.options.grid - 1) {
            this.drawModal(this.resultInfo)
          }
        })
      }, 500*i)
    }
  }

  /*
  * 插件封装
  */
  $.fn.slot = function (options) {
    let args = Array.prototype.slice.call(arguments, 1)
    return this.each(() => {
      let instance = $(this).data('slot')
      if (instance) {
				instance[options].apply(instance, args)
			} else {
				instance = $(this).data('slot', new Slot(options, this))
			}
    })
	}
})(window)
