
Page({
  data: {
    news: {},
    imgList: []
  },
  onLoad: function (options) {

    let title = options.title
    let display_time = options.display_time
    let official_account = options.official_account
    let web_url = options.web_url

    this.setData({
      news: {
        title: title,
        display_time: display_time,
        official_account: official_account,
        web_url: web_url
      }
    })

    let url = options.url
    this.getData(url)
  },
  getData(url) {
    wx.showLoading({
      title: '正在加载数据'
    })
    var that = this;
    wx.cloud.callFunction({
      name: 'dongqiudi-news-detail',
      data: {
        requestUrl: url
      },
    }).then(res => {
      let news = that.data.news
      let result = res.result;
      if (result != undefined && result != null) {
        news['content'] = result.content
      }

      this.setData({
        news: news,
      })

      news.content.forEach(v => {
        if (v.type == 'image') {
          that.data.imgList.push(v.value)
        }
      });

      wx.hideLoading()
    }).catch(err => {
      // handle error
      console.error(err)
      wx.hideLoading()
    })

  },
  previewImage: function (event) {
    let src = event.currentTarget.dataset.src;//获取data-src
    let imgList = this.data.imgList
    if (imgList.length == 0) {
      imgList.push(src)
    }

    var that = this
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  onShareAppMessage: function () {

  }
})