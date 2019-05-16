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
        $('.tips').removeClass('hide')
      }
    },
    ajaxInfo: () => {
      window.utils.http({
				url: operate.options.dataUrl,
				success (json) {
          if (json && json[0]) {
            operate.renderView(json)
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
    }
  }
  operate.init()
})()
