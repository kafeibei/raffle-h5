(() => {
  // 入口函数
  let operate = {
    options: {
      dataUrl: '../common/json/detail.json'
    },
    init: () => {
      operate.ajaxInfo()
    },
    ajaxInfo: () => {
      window.utils.http({
				url: operate.options.dataUrl,
				success (json) {
          if (json) {
            $('.page-slot').slot({
              data: json
            })
          } else {
            console.warn('抽奖信息错误')
          }
				},
        error (err) {
          console.warn('抽奖信息错误')
        }
			})
    }
  }
  operate.init()
})()
