var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var user = app.globalData.userInfo;

    this.setData({
      avatarUrl: user.avatarUrl,
      nickName: user.nickName
    })
  },
  onUpload: function(e) {
    wx.showModal({
      title: '上传数据',
      content: '换机数据迁移所需，暂不支持',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  onDownload: function(e) {
    wx.showModal({
      title: '同步数据',
      content: '暂无此功能',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  onAboutUs: function(e) {
    wx.showModal({
      title: '反馈',
      content: 'feedback@freedays.cc',
      CancelText: '知道了',
      confirmText: '复制邮箱',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'feedback@freedays.cc',
            success(res) {
              // wx.getClipboardData({
              //   success(res) {
              //     console.log(res.data) // data
              //   }
              // })
            }
          })
        }
      }
    })
  }
})