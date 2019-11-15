// 注意注意！！ 不是单纯的require，引入并赋值给变量

var util = require("../../../utils/util.js");

Page({
  data: {
    listCompleted: [],
    listDoing: [],
    listComing: [],
    bNew: false
  },

  // 页面加载完成触发一次，仅一次
  onLoad() {
    this.initData();
  },
  onShow(options) {
    this.initData();
  },
  onPullDownRefresh(){
    this.initData();
  },


  // 转到打卡详情页面
  edit(e) {
    // e  事件对象
    // e.currentTarget  当前活动对象，list中的某项
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  // 打卡
  signIn(e) {

    // 先验证活动是否在进行中
    var bSucceed = util.signIn(e.currentTarget.dataset.id, e.currentTarget.dataset.begin);

    if (bSucceed > 0) {
      this.initData();
    }
  },

  // 添加新打卡任务
  add() {
    wx.navigateTo({
      url: '../create/create'
    })
  },


  // 登录时，返回所有参与的活动（自己创建的+参与别人的） 
  // 保存在本地缓存中
  // 有修改或者别的，修改远程数据库，但是数据仍读取本地
  initData() {

    var arr = wx.getStorageSync('activity');
    var listDoing = []; 
    var listComing = [];
    var listCompleted = [];
    var bNew = false;

    if (arr.length && arr.length > 0) {

      arr.forEach((item, i) => {
        var beginDate = item.beginDate;
        var endDate = item.endDate;
        var iTaskState = util.retTaskState(beginDate, endDate);
        var bPunched = util.retPunched(item.id);

        // 定义变量要赋值，明确变量类型，不然赋值会不成功
        var d = {
          id: item.id,
          title: item.title,
          beginTime: beginDate,
          endTime: endDate,
          // btnState: 按钮文字
          btnState: util.getBtnText(iTaskState, bPunched),
          // 活动未开始 or 今天已打卡
          disabled: iTaskState != 1 || bPunched,
          // 显示开始时间（活动未开始） 还是 结束时间
          beginShow: iTaskState == 0 ? true : false
        };

        // 0 未开始  1 进行中 2 已结束
        switch (iTaskState) {
          case 0:
            listComing.push(d);
            break;
          case 1:
            listDoing.push(d);
            break;
          case 2:
            listCompleted.push(d);
            break;
        }
      })
    } else {
      bNew = true
    }

    // 如果setData写在if里，onShow调用的时候如果arr为空，list将不能被重新赋值。
    // so 删除最后一个活动返回时会保留显示最后一个活动，因为之前的List残存，又没有被重新赋值
    this.setData({
      listCompleted: listCompleted,
      listDoing: listDoing,
      listComing: listComing,
      bNew: bNew
    })
  }
})