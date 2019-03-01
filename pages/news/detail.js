
Page({
  data: {
    url: '',
    news: {},
    tagList: [],
    imgList: []
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
    this.setData({
      url: url
    })
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

      news.content.forEach(v => {
        if(v.type == 'image') {
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
    if(imgList.length == 0) {
      imgList.push(src)
    }

    var that = this
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  onShareAppMessage: function () {

    let that = this
    return {
      title: '一个安心做内容的足球自媒体',
      path: '/pages/news/detail?url=' + that.data.url + '&title=' + that.data.news.title + '&tags='
    }
  }

})