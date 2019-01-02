
Page({
  data: {
    currentIndex: 0,
    viewList: [],
    viewDataList: {},
    viewPageList: {},
    bannerList: []
  },
  onLoad: function (options) {
    let that = this
    that.getBannerList()

    const coll = wx.cloud.database().collection('system-setting')
    coll.get().then(res => {
      let systemSettingList = res.data
      that.setData({
        viewList: systemSettingList[0].navList
      })
      that.getData(that.data.viewList[that.data.currentIndex].key)
    })
  },
  swiperChangeFunc(event) {
    let current = event.detail.current
    this.setData({
      currentIndex: current
    })

    this.toggleView(current)
  },
  toggleNav(event) {
    let id = event.currentTarget.id
    let index = id.replace('nav-', '')
    this.setData({
      currentIndex: index
    })
  },
  toggleView(index) {
    let key = this.data.viewList[index].key

    let _viewDataList = this.data.viewDataList
    let _viewPageList = this.data.viewPageList
    if (_viewDataList[key] == undefined || _viewDataList[key].length == 0) {

      wx.showLoading({
        title: '正在加载…'
      })

      _viewPageList[key] = {
        loading: false,
        loadAll: false,
        pno: 1,
      }
      _viewDataList[key] = []

      this.setData({
        viewDataList: _viewDataList,
        viewPageList: _viewPageList
      })

      this.getData(key)
    }
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
      name: 'hbzq-news-list',
      data: {
        requestUrl: 'http://www.hebeizuqiu.net' + (key == 'index' ? '' : '/' + key),
        pno: _pageInfo.pno
      },
    }).then(res => {
      if (_viewDataList[key] == undefined) {
        _viewDataList[key] = []
      }
      var list = res.result;
      _viewDataList[key] = _pageInfo.pno == 1 ? list : _viewDataList[key].concat(list)


      let _loadAll = false
      if (_viewDataList[key].length == 0) {
        _loadAll = true
        console.log('empty list')
      } else if (list.length < 10) {
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
  getBannerList(key) {
    var that = this;
    wx.cloud.callFunction({
      name: 'hbzq-news-hot',
      data: {},
    }).then(res => {
      var list = res.result;
      that.setData({
        bannerList: list
      })
    }).catch(err => {
      // handle error
      console.error(err)
    })
  },
  scroll2Bottom() {
    let key = this.data.viewList[this.data.currentIndex].key
    this.getData(key)
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载…'
    })

    let key = this.data.viewList[this.data.currentIndex].key

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
  onShareAppMessage: function () {

  }
})