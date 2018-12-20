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
    var threeThings = wx.getStorageSync('threeThings').threeThings;

    if (threeThings) {
      this.setData({
        threeThings: threeThings
      })
    }
  },

  submitThreeThings: function(event) {


    var value = event.detail.value;
    var tempArr = [];
    console.log(value);
    for (var i = 1; i <= 3; i++) {
      if (value['item-' + i].trim().length > 0) {
        tempArr.push(value['item-' + i]);
      }
    }

    var data = {
      time: new Date(),
      threeThings: tempArr
    }

    wx.setStorageSync('threeThings', data);
    wx: wx.navigateBack({
      delta: 1,
    })
  }
})