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
  getDate(bIncludeToday){

    var beginDate, endDate;
    var now = new Date();

    beginDate = bIncludeToday ? util.formatFutureTime(now, 0) : util.formatFutureTime(now,1);
    endDate = util.formatFutureTime(beginDate, this.data.sumDays - 1);
    // console.log("beginDate:" + beginDate);
    // console.log("endDate:" + endDate);

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
    var sumDays = parseInt(e.detail.value);
    if (sumDays && sumDays > 0){
      this.setData({
        sumDays: sumDays,
        endDate: util.formatFutureTime(this.data.beginDate, sumDays - 1)
      })
    }
  },

  // 两种绑定函数的写法。
  // 时间设定
  // 怎么都觉得这里有些重复
  bindBeginDateChange(e) {
    var beginDate = e.detail.value;
    var endDate = util.formatFutureTime(beginDate, this.data.sumDays-1);
    // console.log("改开始时间：beginDate:" + beginDate);
    // console.log("endDate:" + endDate);
    this.setData({
      beginDate: beginDate,
      endDate: endDate
    })
  },
  
  bindEndDateChange: function(e) {
    // console.log("endDate:" + e.detail.value)

    var endDate = e.detail.value;
    var sumDays = util.getSumDays(this.data.beginDate, endDate);

    this.setData({
      sumDays: sumDays,
      endDate: endDate
    })
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
    // console.log("createActivity");
    // 活动名称自然不可为空
    if (this.data.title.length == 0) {

      wx.showModal({
        title: 'Hey, 别急',
        content: '请先给计划起个名字',
        showCancel: false
      })
      return;
    }

    // 先验证时间的合理性
    // 结束时间 > 开始时间 > now
    var begin = this.data.beginDate; // + ' ' + this.data.beginTime;
    var end = this.data.endDate; // + ' ' + this.data.endTime;
    var msg = util.checkTime(begin, end)
    if (msg.length) {
      wx.showModal({
        title: '出错啦',
        content: msg,
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