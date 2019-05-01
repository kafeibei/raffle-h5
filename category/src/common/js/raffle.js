((window) => {
  // 抽奖弹窗逻辑处理
  $.fn.lotteryModal = function(options) {
		let args = Array.prototype.slice.call(arguments, 1)
		return this.each(function() {
			var instance = $(this).data('modal')
			if (instance && instance[options]) {
				instance[options].apply(instance, args)
			} else {
				instance = $(this).data('modal', new lotteryModal(options, this))
			}
		})
	}

	function lotteryModal(options, element) {
		this.options = $.extend({}, $.fn['lotteryModal'].defaults, options || {})
		this.el = $(element).find('.lotteryModal')
		this.init()
	}

	lotteryModal.prototype = {
		constructor: lotteryModal,

		init: function () {
      this.utils = window.utils
      this.oauth()
			this.events()
		},

		events: function () {
			let plat = window.utils.mobileDevice()
			let ltype = (plat == 'Other') ? 'click' : 'touchstart'
			this.el
			   .on(ltype, '.no-win', $.proxy( this._closeDialog, this))	// 关闭弹框
			   .on(ltype, '.btn-close', $.proxy( this._closeDialog, this ))	 //关闭弹框
			   .on(ltype, '.btn-detail', $.proxy( this._getDetail,this))    //获奖详情
			   .on(ltype, '.btn-back', $.proxy( this._goBack,this))  //返回
		},

    oauth: function () {
      setTimeout(() => {
				this.options.oauthBack && this.options.oauthBack()
			}, 200)
    },

		draw : function (cbk) {
			this._lottery(cbk)
		},

 		_lottery: function (cbk) {
			this.utils.loading.show(this.el)
      this.utils.http({
        url: '../common/json/detail.json',
        success: (json) => {
          if (json && json.rewards) {
            let len = json.rewards.length
            let num = this.utils.randomGap(len, 0)
            let result = json.rewards[num]
            if (result.redeemable) {
    					this.drawPop({
                title: result.title,
                encourage: result.reward
              })
    				} else {
    					//未中奖
	    				this.noAward()
    				}
            cbk(1, result)
          } else {
            cbk(-1, '奖项设置错误')
          }
          this.utils.loading.close()
        },
        error: () => {
          cbk(-1, '奖项信息加载失败')
          this.utils.loading.close()
          this._closeDialog()
        }
      })
		},

		//未中奖
		noAward : function () {
      this.drawPop({
        title: '很遗憾没有中奖',
        encourage: '不要气馁，继续加油'
      })
		},

    drawPop: function (params) {
      let drawModal = this.el.find('.draw-wrap')
			if (!drawModal[0]) {
				drawModal = $(this.options.draw_tpl).appendTo(this.el)
			}
      let drawHtml = drawModal.removeClass('hide').html()
      drawHtml = drawHtml.replace(/{{(.*?)}}/g, (string, key) => {
        return string.replace('{{' + key + '}}', params[key])
      })
      drawModal.html(drawHtml)
    },

    // 查看抽奖结果
    result: function () {
      this.utils.loading.show(this.el)
      this.utils.http({
        url: '../common/json/result.json',
        success: (json) => {
          if (json && json[0]) {
            this._renderResult(json)
          } else {
            this.drawPop({
              title: '中奖结果',
              encourage: '您还没有中奖纪录哦！'
            })
          }
          this.utils.loading.close()
        },
        error: () => {
          this.drawPop({
            title: '中奖结果',
            encourage: '抽奖结果加载失败'
          })
          this.utils.loading.close()
        }
      })
    },

    // 查看抽奖详情
    _getDetail: function (event) {
      let self = $(event.currentTarget)
      let index = self.closest('.result-item').index()
      let result = this.resultData[index]
      $('.result-wrap').addClass('hide')
      this.drawPop({
        title: result.title,
        encourage: result.reward
      })
    },

		_goBack: function () {
			$('.draw-wrap').remove()
      $('.result-wrap').removeClass('hide')
		},

		_renderResult: function (json) {
      let resultDom = this.el.find('result-wrap')
      if (!resultDom[0]) {
        resultDom = $(this.options.result_tpl).appendTo(this.el)
      }
      let resultsUl = resultDom.find('.results').empty()

      if(json && json[0]){
        let result_ul = ''
        let result_li = this.options.result_li
        json.forEach((item, key) => {
          result_ul += result_li.replace(/{{liv_(.*?)}}/g, (string, kk) => {
            return string.replace('{{liv_' + kk + '}}', item[kk])
          })
        })
        $(result_ul).appendTo(resultsUl)
        this.resultData = json
      }
		},

		_closeDialog: function (event) {
			$('.lotteryBox').addClass('hide')
			$('.lotteryModal').empty().addClass('hide');
		}
	};

	$.fn['lotteryModal'].defaults = {
    result_tpl : ''+
    	'<div class="lottery-wrap result-wrap">' +
        '<p class="title">中奖结果</p>' +
    		'<ul class="results">{liv_results}</ul>' +
        '<em class="btn-close">关闭</em>' +
    	'</div>' +
      '',
    result_li: '' +
      '<li class="result-item clear">' +
        '<span>{{liv_reward}}</span>' +
        '<button class="btn-detail">详情</button>' +
      '</li>' +
      '',
    draw_tpl : '' +
    	'<div class="lottery-wrap draw-wrap hide">' +
        '<p class="title">{{title}}</p>' +
        '<p class="encourage">{{encourage}}</p>' +
        '<em class="btn-close">关闭</em>' +
        '<em class="btn-back">返回</em>' +
    	'</div>' +
      ''
	}

  // 弹窗开关处理
  $.controlModal = function (options, cbk) {
    let modal = $('.lotteryBox')
		if (!modal[0]) {
    	modal = $(
        '<div class="lotteryBox hg-flex hg-flex-center hg-justify-center hide">' +
        ' <div class="lotteryModal"></div>' + '</div>').appendTo('body')
    	modal.on({
    		_init: () => {
          modal.lotteryModal(options)
    		},
    		'_show': (event, options) => {
    			$('.lotteryModal').removeClass('hide')
    			modal[(options.func == 'detail' ? 'add' : 'remove') + 'Class']("hide")
            .lotteryModal(options.func, options.cbk)
    		},
    		'_hide': () => {
    			modal.addClass("hide")
    		}
      })
			let plat = window.utils.mobileDevice()
			let ltype = (plat == 'Other') ? 'click' : 'touchstart'

      modal.on(ltype, (event) => {
      	event.stopPropagation()
      	if($(event.target).is('.lottery-wrap') || $(event.target).closest('.lottery-wrap').length == 1) {
       		return
       	}
       	// 去掉点击周围关闭弹框
       	// modal.find('.lotteryModal').empty()
       	// 	.end().trigger('_hide');
      })
    }
		if (typeof options === 'string') {
			modal.trigger('_show', {
        func: options,
        cbk: cbk
      })
			return false
		}
		modal.trigger('_init')
  }

  // 抽奖业务逻辑
  function Raffle () {
    this.wrapper = $('.button-area')
    this.utils = window.utils
  }

  Raffle.prototype = {
    constructor: Raffle,

    /*
		 * 实例化
		 * @method init
		 * @param null
		 * */
    init: function () {
      this._events()
    },

    /*
		 * 绑定事件
		 * @method _events private
		 * @param null
		 * */
    _events: function () {
      this.wrapper
				.on('click', '.raffle-result', $.proxy(this._result, this))
				.on('click', '.raffle-reset', $.proxy(this._reset, this))
      this.extraEvent && this.extraEvent()	//增加额外绑定事件钩子
    },

    /*
    * 实例化抽奖弹窗
    */
    initModal: function (cbk) {
      let message = this._limit()
      if (message) {
        this.utils.toast({
          msg: message
        })
        return false
      }
      let count = utils.storage.get('raffle_count') || 0
      utils.storage.set('raffle_count', ++count)
      $.controlModal({
        oauthBack: cbk
      })
    },

    /*
    * 获取抽奖结果
    * @method drawModal
    */
    drawModal: function (cbk) {
      $.controlModal('draw', (status, data) => {
        if (status > 0) {
          // 正确返回抽奖结果
          cbk && cbk(1, data)
        } else {
          this.utils.toast(data)
        }
      })
    },

    /*
		 * 重置抽奖状态
		 * @method _reset private
		 * @param null
		 * */
    _reset: function () {
      this.initReset()
    },

    /*
		 * 查看抽奖结果
		 * @method _result private
		 * @param null
		 * */
    _result: function () {
      $.controlModal('result', (status, data) => {
        console.log('status', status, data)
        if (status > 0) {
          // 正确返回抽奖结果
          // cbk && cbk(1, data)
        } else {
          this.utils.toast(data)
        }
      })
    },

    /*
		 * 抽奖限制条件
		 * @method _limit private
		 * @param null
		 * */
    _limit: function () {
      let message = ''
      let count = utils.storage.get('raffle_count') || 0
      let now = utils.formatTime(null, 'yyyy-MM-dd')
      if (this.options.data) {
        if (this.options.data.limit_count < count) {
          message = '达到抽奖最大次数'
        } else if (this.options.start_time && this.options.start_time > now) {
          message = '抽奖暂未开始'
        } else if (this.options.end_time && this.options.end_time < now) {
          message = '抽奖已结束'
        }
      }
      return message
    }
  }

  window.Raffle = Raffle
})(window)
