var util = require("../../../utils/util.js");

Page({

  data: {

    // 活动状态
    state: '',
    btnState: '',
    disabled: false,

    // 打卡详情
    punchCount: 0,
    sumDays: 0,
    activity: []
  },

  // 加载初始化
  onLoad(e) {
    this.initBaseData(e.id);
    this.initPunchData(e.id);
  },

  // 基础数据
  initBaseData(id) {
    var arr = wx.getStorageSync('activity');

    if (arr.length) {
      arr.forEach((item) => {

        if (item.id == id) {

          var beginDate = item.beginDate;
          var endDate = item.endDate;
          var iTaskState = util.retTaskState(beginDate, endDate);
          var bPunched = util.retPunched(item.id);

          this.setData({
            id: id,
            title: item.title,
            content: item.content,
            createTime: item.createTime,
            beginDate: beginDate,
            endDate: endDate,

            // state: 如果需要活动角标的话...
            // state: util.getTaskState(iTaskState),
            stateColorClass: util.getTaskColorClass(iTaskState),
            // btnState: 按钮文字
            btnState: util.getBtnText(iTaskState, bPunched),

            // 活动未开始 or 今天已打卡
            disabled: iTaskState != 1 || bPunched,

            sumDays: item.sumDays
          })
        }
      })
    }
  },
  // 打卡记录、勋章
  initPunchData(id) {

    var data = wx.getStorageSync('signin' + id);

    // 每次打卡详细记录 data.arrRecord
    var arrRecord = data.arrRecord ? data.arrRecord : [];

    // 打卡情况总览 date.reconds
    var records = data.records ? data.records : [];

    // 已打卡天数
    var punchCount = data.punchCount ? data.punchCount : 0;

    // 最长累计打卡天数
    var serialMaxDays = data.serialMaxDays ? data.serialMaxDays : 0;
    
    // 勋章 data.medalCount 
    var medalCount = data.medalCount ? data.medalCount : 0;

    // 打卡已持续天数 data.lastedDays
    var lastedDays = util.getSumDays(this.data.beginDate, util.formatDate(new Date()));

    var d = [];
    for (var i = 0; i < lastedDays; i++) {
      if (records && records[i]) {
        d.push(true);
      } else {
        d.push(false);
      }
    }
    // console.log('打卡记录总览赋值', d);


    this.setData({
      punchCount: punchCount,
      medalCount: medalCount,
      serialMaxDays: serialMaxDays,
      activity: d,
      arrRecord: arrRecord
    })
  },

  // 创建者结束活动
  stopActivity() {

    var that = this;
    wx.showModal({
      title: '提示',
      content: '将删除相关数据，继续操作？',
      showCancel: true,

      success: function(res) {
        if (res.confirm) {

          that.DeleteActivity(that.data.id);
          // 活动被销毁，返回main
          wx.navigateBack({
            url: '../main/main?update=true'
          })
        }
      }
    })
  },

  // 删除活动，
  // 依据活动id  删除该id下的所有数据
  // 单人的，删除自己的数据
  // 多人的，仅删除自己的并结束活动？
  DeleteActivity(id) {

    // Del 这个活动 
    var arr = wx.getStorageSync('activity');
    var data = [];
    if (arr.length) {
      arr.forEach((item) => {
        if (item.id != id) {
          data.push(item);
        }
      })
      wx.setStorageSync('activity', data);
    }

    // Del 这个活动下的打卡数据
    wx.removeStorageSync('signin' + id);
  },

  // 这里签到。签到成功刷新当前页面
  signIn() {

    var id = this.data.id;
    var bSucceed = util.signIn(id, this.data.beginDate);
    if (bSucceed) {
      this.initPunchData(id);
      this.setData({
        btnState: util.getBtnText(1, true),
        disabled: true
      })
    }
  }
})