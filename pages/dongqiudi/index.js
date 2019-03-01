Page({
  data: {
    viewDataList: {},
    viewPageList: {},
    key: 'dongqiudi'
  },
  onLoad: function (options) {
    this.getData(this.data.key);
  },
  getData(key) {
    let _viewDataList = this.data.viewDataList
    let _viewPageList = this.data.viewPageList

    //--- 初始化数据和page信息--- start
    if (_viewDataList[key] == undefined) {
      _viewDataList[key] = []
    }
    if (_viewPageList[key] == undefined) {
      _viewPageList[key] = {
        loading: false,
        loadAll: false,
        pno: 1,
      }
    }
    this.setData({
      viewDataList: _viewDataList,
      viewPageList: _viewPageList
    })
    //--- 初始化数据和page信息--- end

    let _pageInfo = this.data.viewPageList[key]

    if (_pageInfo.loading) {
      return
    }
    if (!_pageInfo.loadAll) {

      _viewPageList[key] = {
        loading: true,
        loadAll: false,
        pno: _pageInfo.pno,
      }

      this.setData({
        viewDataList: _viewDataList,
        viewPageList: _viewPageList
      })
    } else {
      wx.stopPullDownRefresh()
      return
    }

    var that = this;
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'dongqiudi-news-list',
      data: {
        pno: _pageInfo.pno
      },
    }).then(res => {
      if (_viewDataList[key] == undefined) {
        _viewDataList[key] = []
      }
      var list = [];
      res.result.forEach(v => {
        v.time = v.display_time.substr(5, 11)
        list.push(v)
      });
      _viewDataList[key] = _pageInfo.pno == 1 ? list : _viewDataList[key].concat(list)

      let _loadAll = false
      if (_viewDataList[key].length == 0) {
        _loadAll = true
        console.log('empty list')
      } else if (_pageInfo.pno == 49) {
        _loadAll = true
        wx.showToast({ title: '已加载全部!', icon: 'success' })
      }
      _viewPageList[key] = {
        loading: false,
        loadAll: _loadAll,
        pno: _pageInfo.pno + 1,
      }

      that.setData({
        viewDataList: _viewDataList,
        viewPageList: _viewPageList,
      })

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(err => {
      // handle error
      console.error(err)

      _viewPageList[key] = {
        loading: false,
        loadAll: false,
        pno: _pageInfo.pno,
      }
      that.setData({
        viewDataList: _viewDataList,
        viewPageList: _viewPageList,
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })

  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在更新数据'
    })

    let key = this.data.key

    let _viewPageList = this.data.viewPageList
    _viewPageList[key] = {
      loading: false,
      loadAll: false,
      pno: 1,
    }
    this.setData({
      viewPageList: _viewPageList
    })

    this.getData(key)
  },
  onReachBottom: function () {
    let key = this.data.key
    this.getData(key)
  },
  onShareAppMessage: function () {
    let that = this
    return {
      title: '一个安心做内容的足球自媒体',
      path: '/pages/dongqiudi/index'
    }
  }
})