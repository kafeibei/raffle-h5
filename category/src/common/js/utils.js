((window) => {
  /*
  * utils 功能函数封装
  */
  let utils = {}

  /*
  * 获取连续数据之间的随机值
  * @method randomGap
  * @param number
  */
  utils.randomGap = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  /*
  * 获取连续数据之间的随机值
  * @method mobileDevice
  * @param string
  */
  utils.mobileDevice = (isplat) => {
    let mbldevice = navigator.userAgent.toLowerCase()
		if (isplat) {
			if (/micromessenger/.test(mbldevice)) {
				return 'wechat'
			} else if(/dingtalk/.test( mbldevice) || /aliapp/.test( mbldevice)){
				return 'dingding'
			}
			return 'other'
		}
		if (/iphone|ipod|ipad/gi.test(mbldevice)) {
			return 'iOS'
		} else if (/android/gi.test(mbldevice)){
			return 'Android'
		} else {
			return 'Other'
		}
  }

  utils.http = (options, param) => {
		$.ajax({
			url: options.url,
			type: options.method || 'get',
			data: param || {},
			contentType: options.contentType || 'application/x-www-form-urlencoded',
			timeout: 38000,
			dataType: 'json',
      crossDomain: true,
			xhrFields: {
      	withCredentials: true
      },
			success: (json, status, xhr) => {
				$.isFunction(options.success) && options.success(json)
			},
			error: (xhr, status, errorTrown) => {
				$.isFunction(options.error) && options.error(xhr)
    	}
		})
	}
  /*
  * 页面loading效果
  * @method loading
  * @param null
  */
  utils.loading = {
    _tmpl: function () {
			return '' +
        '<div class="loader loader-area">' +
        ' <div class="loader-content">' +
	      '    <div class="loader-progress">' +
        '     <div class="loader-animate"></div>' +
        '      加载中...' +
        '    </div>' +
	      '  </div>' +
	     	'</div>'
		},

		_create: function (cssInfo) {
			this.loading = $(this._tmpl()).appendTo('body')
				.css({
					position: 'absolute',
					width: cssInfo.width + 'px',
          height: cssInfo.height + 'px',
          left: cssInfo.left + 'px',
          top: cssInfo.top + 'px',
          display: 'inline-block',
          'z-index': cssInfo['z-index'] > 100000 ? cssInfo['z-index'] : 100000,
          'background-color' : 'rgba(0, 0, 0, 0.0)'
				})
		},

		show: function(dom) {
			if (typeof dom === 'undefined') {
				dom = $('body')
			}
			dom = typeof dom == 'string' ? $(dom) : dom
			if (!dom.length) {
				return false
			}
			let cssInfo = {}
			$.extend(cssInfo, dom.offset())
			cssInfo.width = dom.outerWidth()
      cssInfo.height = dom.outerHeight()
      cssInfo['z-index'] = dom.css('z-index')
     	this._create(cssInfo)
		},

		close: function () {
			this.loading && this.loading.remove()
			this.loading = null
			setTimeout(() => {
        let loader = $('body').find('.loader')
				loader.length && loader.remove()
        loader = null
			}, 200)
		}
  }

  utils.toast = (options, cbk) => {
    let param = {
			delay : 1500
		}
		if (typeof options === 'string') {
			param.msg = options
		} else {
			param = $.extend( param, options )
		}
		if (!param.msg) {
			return false
		}
		if (utils.timeout) {
			clearTimeout(utils.timeout)
			utils.timeout = null
		}
		let toast = $('body').find('.toastTip')
		if (!toast.length) {
			let cssStyle = {
				position: 'fixed',
				left: '50%',
				top: '50%',
				'z-index': 9999,
				background: 'rgba(0,0,0,0.8)',
				color: '#fff',
				'-webkit-transform': 'translate3d(-50%, -50%, 0)',
				'transform': 'translate3d(-50%, -50%, 0)'
			}
      cssStyle = $.extend({
        'line-height': '28px',
        padding: '5px 10px',
        'border-radius': '3px',
        'font-size': '14px'
      }, cssStyle)
			toast = $('<div class="toastTip"/>').appendTo('body')
				.css(cssStyle)
		}
		toast.html(param.msg)

		utils.timeout = setTimeout(() => {
			toast.remove()
			$.isFunction(cbk) && cbk()
		}, param.delay)
  }

  utils.modal = (options) => {
    options = $.extend({
      title: '提示',
      brief: '',
      id: '',
      ok: '确定',
      cancel: '取消'
    }, options)
		let modal = $('#' + options.id)
		if (!modal.length) {
			let tmpl =
				'<div class="modal-page hide" id="' + options.id + '">'+
					'<div class="modal-box">'+
						'<p class="modal-title">{{liv_title}}</p>'+
						'<p class="modal-brief">{{liv_brief}}</p>'+
						'<div class="modal-button">' +
							'<a class="btn btn-middle btn-default btn-cancel" attr="cancel">{{liv_cancel}}</a>' +
							'<a class="btn btn-middle btn-primary btn-ok" attr="ok">{{liv_ok}}</a>' +
						'</div>'+
					'</div>'+
				'</div>'
			modal = $(tmpl).appendTo('body')
		}
		modal.off('click', '.btn')
			.on('click', '.btn', function() {
				var attr = $(this).attr('attr')
				options[attr + 'Back'] && options[attr + 'Back']()
				modal.addClass('hide')
			})

		let modalHtml = modal.removeClass('hide').html()
    modalHtml = modalHtml.replace(/{{liv_(.*?)}}/g, (string, key) => {
      return string.replace('{{liv_' + key + '}}', options[key] || '')
    })
    modal.html(modalHtml)
	}

  utils.storage = {
		set: (key, value, time, method) => {
			method = method || 'localStorage'
			let data = {
				value: JSON.stringify(value)
			}
			if (typeof time == 'number') {
				let valid = time * 60 * 1e3
				data.timestamp = (new Date).getTime() + valid
			} else {
				data.timestamp = null
			}
			return window[method].setItem(key, JSON.stringify(data))
		},
		get: (key, method) => {
			method = method || 'localStorage'
			var data = JSON.parse(window[method].getItem(key))
			return data && data.value ? data.timestamp === null ? JSON.parse(data.value) : (new Date).getTime() < data.timestamp && JSON.parse(data.value) || !1 : !1
		},
		remove: (key, method) => {
			method = method || 'localStorage'
			window[method].removeItem(key)
		},
		clear: (method) => {
			method = method || 'localStorage'
			window[method].clear()
		}
	}

  utils.formatTime = (date, transform) => {
    date = date ? new Date(date) : new Date()
    transform = transform || 'yyyy-MM-dd HH:mm:ss'
    let year = date.getFullYear()
    let month = utils.formatNumber(date.getMonth() + 1)
    let day = utils.formatNumber(date.getDate())
    let hour = utils.formatNumber(date.getHours())
    let minute = utils.formatNumber(date.getMinutes())
    let second = utils.formatNumber(date.getSeconds())
    transform = transform.replace('yyyy',year)
      .replace('MM',month).replace('dd',day)
      .replace('HH',hour).replace('mm',minute)
      .replace('ss',second)
      return transform
	}

  utils.formatNumber = (n) => {
	  n = n.toString()
	  return n[1] ? n : '0' + n
	}

  window.utils = utils
})(window)
