(() => {
  function Instant(options, element) {
    this.options = {
      activityClass: 'activity-status',
      result_tpl: '' +
        '<div class="instant-inner hg-flex hg-flex-center">' +
          '<div class="img-box instant-pic {{liv_pic_hide}}">{{liv_pic}}</div>' +
          '<div class="hg-flex-one instant-info">' +
            '<h2 class="instant-title">{{liv_title}}</h2>' +
            '<p class="instant-reward">{{liv_reward}}</p>' +
          '</div>' +
        '</div>' +
        '',
        error_tpl: '' +
          '<div class="instant-inner hg-flex hg-flex-center hg-justify-center">' +
            '<p class="instant-reward">{{liv_message}}</p>' +
          '</div>' +
          ''
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
      this.renderInstant(message)
      return false
    }
    this.lotteryModal((status, data) => {
      if (status > 0) {
        if (data.redeemable) {
          this.renderInstant(data)
        } else {
          this.renderInstant(data.reward)
        }
      } else {
        this.renderInstant(data)
      }
    })
  }

  Instant.prototype.renderInstant = function (item) {
    let result_tpl
    if (typeof item === 'string') {
      result_tpl = this.options.error_tpl.replace('{{liv_message}}', item)
    } else {
      result_tpl = this.options.result_tpl.replace(/{{liv_(.*?)}}/g, (string, key) => {
        if (key === 'pic') {
          if (item.pic) {
            return '<img src="' + item.pic + '" title="' + item.reward + '">'
          }
          return ''
        } else if (key === 'pic_hide') {
          if (item.pic) {
            return string.replace('{{liv_' + key + '}}', '')
          }
          return 'hide'
        }
        return string.replace('{{liv_' + key + '}}', item[key] || '')
      })
    }
    this.element.find('.instant-content').removeClass('hide').empty().append(result_tpl)
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
