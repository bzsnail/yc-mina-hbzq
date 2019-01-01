
Page({
  data: {
    news: {},
    tagList: []
  },
  onLoad: function (options) {
    let tags = options.tags
    if(tags != undefined && tags.length > 0) {
      this.setData({
        tagList: tags.split(',')
      })
    }

    let title = options.title
    if(title != undefined) {
      this.setData({
        news: {
          title: title
        }
      })
    }

    let url = options.url
    this.getData(url)
  },
  getData(url) {
    wx.showLoading({
      title: '正在加载…'
    })
    var that = this;
    wx.cloud.callFunction({
      name: 'hbzq-news-detail',
      data: {
        requestUrl: url
      },
    }).then(res => {
      let news = res.result;
      this.setData({
        news: news,
      })
      wx.hideLoading()
    }).catch(err => {
      // handle error
      console.error(err)
      wx.hideLoading()
    })

  },
  onShareAppMessage: function () {

  }
})