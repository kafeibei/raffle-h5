(() => {
  // 入口函数
  let operate = {
    options: {
      dataUrl: './common/json/guide.json',
      tmpl: '' +
        '<li class="raffle-item hg-flex">' +
          '<div class="img-box">' +
            '<img src="{{liv_src}}"/>' +
          '</div>' +
          '<div class="hg-flex-one">' +
            '<h2 class="raffle-title">{{liv_title}}</h2>' +
            '<p class="raffle-brief">{{liv_brief}}</p>' +
          '</div>' +
          '<a class="outlink" href="{{liv_href}}"></a>' +
        '</li>' +
        ''
    },
    init: () => {
      operate.tips()
      operate.ajaxInfo()
    },
    tips: () => {
      let plat = window.utils.mobileDevice()
      if (plat === 'Other') {
        $('.qrcode-box').removeClass('hide')
        operate.qrcode()
      }
    },
    qrcode: () => {
      let qrcode = new QRCode($('.qrcode-area')[0], {
      	text: window.location.href,
      	width: 128,
      	height: 128,
      	colorDark : "#000",
      	colorLight : "#fff",
      	correctLevel : QRCode.CorrectLevel.H
      })
    },
    ajaxInfo: () => {
      window.utils.http({
				url: operate.options.dataUrl,
				success (json) {
          if (json && json[0]) {
            operate.renderView(json)
            operate.clearStorage()
          } else {
            console.warn('引导页信息错误')
          }
				},
        error (err) {
          console.warn('引导页信息错误')
        }
			})
    },
    renderView: (json) => {
      let li_tmpl = ''
      json.forEach(item => {
        li_tmpl += operate.options.tmpl.replace(/{{liv_(.*?)}}/g, (string, key) => {
          if (key === 'href') {
            return string.replace('{{liv_href}}', './' + item.key)
          } else if (key === 'src') {
            return string.replace('{{liv_src}}', './common/images/guide/' + item.key + '.png')
          }
          return string.replace('{{liv_' + key + '}}', item[key] || '')
        })
      })
      $('.page-guide').append(li_tmpl)
    },
    clearStorage: () => {
      $('.clear-button').removeClass('hide').find('.btn-clear').click(() => {
        window.utils.modal({
          id: 'clearStorage',
          brief: '您确定要清除抽奖数据吗？',
          okBack: () => {
            window.utils.storage.remove('raffle_count')
            window.utils.storage.remove('raffle_result')
            window.location.reload()
          }
        })
      })
    }
  }
  operate.init()
})()
