var util = require('../../../utils/util.js');

Page({
  data: {
    title: '',
    content: '坚持打卡~',
    bIncludeToday: true,
    sumDays: 21
  },

  // 加载时初始化一下  时间 
  onLoad() {

    var date = this.getDate(this.data.bIncludeToday);

    this.setData({
      createTime: util.formatTime(new Date()),
      beginDate: date.beginDate,
      endDate: date.endDate
    })
  },

  // 获取 起止时间
  getDate(bIncludeToday) {

    var now = new Date(),
      beginDate = bIncludeToday ? util.formatFutureTime(now, 0) : util.formatFutureTime(now, 1),
      endDate = util.formatFutureTime(beginDate, this.data.sumDays - 1);

    return {
      beginDate: beginDate,
      endDate: endDate
    };
  },


  // 是否包含今天
  bindSwithChange(e) {

    var bIncludeToday = e.detail.value;
    var date = this.getDate(bIncludeToday);

    this.setData({
      bIncludeToday: bIncludeToday,
      beginDate: date.beginDate,
      endDate: date.endDate
    })
  },

  // 设置计划天数
  sumDaysChange(e) {
    var oriSumDays = this.data.sumDays;
    var sumDays = parseInt(e.detail.value);
    if (sumDays && sumDays > 0) {
      this.setData({
        sumDays: sumDays,
        endDate: util.formatFutureTime(this.data.beginDate, sumDays - 1)
      })
    } else {
      wx.showModal({
        title: 'Hey, 别急',
        content: '周期至少是1天',
        showCancel: false
      })
      this.setData({
        sumDays: oriSumDays
      })
    }
  },

  // 两种绑定函数的写法。
  // 时间设定
  // 怎么都觉得这里有些重复
  bindBeginDateChange(e) {
    var beginDate = e.detail.value,
      now = new Date();

    if (util.compareDate(beginDate, now) > 0) {
      var endDate = util.formatFutureTime(beginDate, this.data.sumDays - 1);

      this.setData({
        beginDate: beginDate,
        endDate: endDate
      })
    } else {
      wx.showModal({
        title: 'Hey, 别急',
        content: '开始时间不得早于今天',
        showCancel: false
      })
    }
  },

  bindEndDateChange: function(e) {

    var endDate = e.detail.value,
      beginDate = this.data.beginDate,
      now = new Date();

    if (util.compareDate(endDate, beginDate) > 0 && util.compareDate(endDate, now) > 0) {

      var sumDays = util.getSumDays(beginDate, endDate);
      this.setData({
        sumDays: sumDays,
        endDate: endDate
      })
    } else {
      wx.showModal({
        title: 'Hey, 别急',
        content: '结束时间不得早于开始时间和今天',
        showCancel: false
      })
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

  // 创建新活动。创建成功跳转至创建成功页
  createActivity() {

    // 活动名称自然不可为空
    if (this.data.title.length == 0) {

      wx.showModal({
        title: 'Hey, 别急',
        content: '请先给计划起个名字',
        showCancel: false
      })
      return;
    }

    // 数据保存
    // 缓存中的数据类型是string  console.log(typeof(arr))
    var arr = wx.getStorageSync('activity');
    var data = [];
    var maxID = -1;
    if (arr.length) {
      arr.forEach((item, i) => {
        if (item.id > maxID)
          maxID = item.id;
        data.push(item);
      })
    }

    // 新增数据跟在尾巴上
    var id = maxID + 1;
    this.setData({
      id: id
    })

    data.push(this.data);
    wx.setStorageSync('activity', data);

    // 页面跳转  关闭当前页面
    wx.redirectTo({
      url: '../detail/detail?id=' + id
    })
  }
})