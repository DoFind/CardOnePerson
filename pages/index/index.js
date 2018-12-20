Page({

  /**
   * 页面的初始数据
   */
  data: {
    threeThings: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.initData()
  },
  onShow: function(options) {
    this.initData()
  },

  initData: function() {
    
    var threeThings = wx.getStorageSync('threeThings').threeThings;

    if (threeThings) {
      // console.log('首页', threeThings)
      this.setData({
        threeThings: threeThings
      })
    }
  },

  onAddThreeThings: function(event) {

    wx: wx.navigateTo({
      url: 'create/create',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})