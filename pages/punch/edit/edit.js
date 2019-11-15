var util = require("../../../utils/util.js");

Page({

  data: {
    index: -1
  },

  // 加载时初始化一下  时间 
  onLoad(options) {

    var id = options.id;
    var state = options.state;
    var arr = wx.getStorageSync('activity');

    if (arr.length) {

      var i = 0,
        len = arr.length,
        item;

      for (i = 0; i < len; i++) {
        item = arr[i];
        if (item.id == id) {
          this.setData({
            title: item.title,
            content: item.content,
            sumDays: item.sumDays,
            beginDate: item.beginDate,
            endDate: item.endDate,
            index: i,
            id: id,
            state: state
          })
          break;
        }
      }
    }
  },

  // 设置计划天数
  sumDaysChange(e) {

    var oriSumDays = this.data.sumDays;
    var sumDays = parseInt(e.detail.value);
    var state = this.data.state;
    var minDays = 0,
      now = new Date();

    if (state == 1) {
      // 进行中
      var minDays = util.getSumDays(this.data.beginDate, now)
    }

    if (sumDays && sumDays >= minDays) {
      this.setData({
        sumDays: sumDays,
        endDate: util.formatFutureTime(this.data.beginDate, sumDays - 1)
      })
    } else {
      wx.showModal({
        title: '出错啦',
        content: '周期需大于0且不得小于已过去时光',
        showCancel: false
      })

      this.setData({
        sumDays: oriSumDays
      })
    }
  },

  // 结束时间支持修改
  bindEndDateChange: function(e) {

    var endDate = e.detail.value;
    var beginDate = this.data.beginDate;
    var state = this.data.state;
    var now = new Date();

    if (state == 1) {
      // 进行中 1 结束时间不得小于今天
      if (util.compareDate(endDate, now) > 0) {

        var sumDays = util.getSumDays(beginDate, endDate);
        this.setData({
          sumDays: sumDays,
          endDate: endDate
        })
      } else {
        wx.showModal({
          title: '出错啦',
          content: '结束时间不得早于今天',
          showCancel: false
        })
      }
    } else {
      // 未开始 0 结束时间不得小于开始时间
      if (util.compareDate(endDate, beginDate) > 0) {

        var sumDays = util.getSumDays(beginDate, endDate);
        this.setData({
          sumDays: sumDays,
          endDate: endDate
        })
      } else {
        wx.showModal({
          title: '出错啦',
          content: '结束时间不得早于起始时间',
          showCancel: false
        })
      }
    }
  },

  // 标题，简介 设定
  titleChange(e) {
    this.setData({
      title: e.detail.value
    })
  },
  contentChange(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 编辑提交
  editActivity() {

    var data = this.data;

    if (data.title.length == 0) {

      wx.showModal({
        title: 'Hey, 别急',
        content: '计划名称不得为空',
        showCancel: false
      })
      return;
    }

    // 数据保存
    // 缓存中的数据类型是string  console.log(typeof(arr))
    var arr = wx.getStorageSync('activity'),
      index = this.data.index,
      editItem = arr[index];

    editItem.title = data.title;
    editItem.content = data.content;
    editItem.endDate = data.endDate;
    editItem.sumDays = data.sumDays;

    arr[index] = editItem

    wx.setStorageSync('activity', arr);

    // 页面跳转  关闭当前页面
    wx.redirectTo({
      url: '../detail/detail?id=' + data.id
    })
  }
})