var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类信息显示需要.....
    lifeList: [],
    // 避免重复读取缓存
    OriginList: [],
    // 全部的信息分类显示....
    allList: {},
    bNew: false,

    tags: [],
    curTag: '全部',
    bHideDesc: false,
    strText: '显示描述详情'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.initTags();
    this.initLifeList();
    // this.clearStorage();
  },
  onShow: function() {
    this.initTags();
    this.initLifeList(this.data.curTag);
  },

  // !!! 添加新标签之后，也需要更新
  // 如果标签下的内容用筛选，这里是 array 就可
  // 如果标签下 直接用obj.attr 那需要更新..update
  initTags: function() {
    var data = wx.getStorageSync('lifeListTags');
    var tags = data ? data : app.globalData.g_tags;
    this.setData({
      tags: tags
    })
    // wx.setStorageSync('lifeListTags', tags);
  },

  clearStorage: function() {
    wx.removeStorageSync('lifeListTags');
    wx.removeStorageSync('lifeList');
  },

  isEmptyObject: function(obj) {

    for (var key in obj) {
      return false;
    };
    return true;
  },

  initLifeList: function(tag) {
    // console.log('initLifeList', tag);
    if (tag) {

      if (tag == '全部') {
        this.setData({
          allList: this.getAllList(),
          curTag: '全部'
        })
      } else {
        // 这里需要重新获取最新数据，因为有添加
        var allList = this.getAllList();
        if (!this.isEmptyObject(allList)) {
          this.setData({
            allList: allList,
            lifeList: allList[tag],
            curTag: tag
          })
        } else {
          this.setData({
            allList: {},
            lifeList: [],
            curTag: tag
          })
        }
      }
    } else {

      this.setData({
        allList: this.getAllList(),
        curTag: '全部'
      })
    }
  },

  getAllList: function() {
    // init 完全...
    var lifeList = wx.getStorageSync('lifeList');

    // var f = !!lifeList;
    // console.log(lifeList);
    // console.log(lifeList.objs.length);
    // console.log('bOld', f);

    this.setData({
      OriginList: lifeList,
      bNew: !(lifeList)
    });

    var allList = {};

    // 全部，按照分类来 
    if (lifeList && !this.isEmptyObject(lifeList.objs)) {

      var item, tag;
      for (var key in lifeList.objs) {

        item = lifeList.objs[key];
        tag = item.tag;
        for (var i = 0, len = tag.length; i < len; i++) {

          if (!allList[tag[i]]) {
            allList[tag[i]] = [];
          }
          allList[tag[i]].push({

            id: item.id,
            title: item.title,
            desc: item.desc,
            state: item.state
          })
        }
      }
    };
    // console.log(allList);
    return allList;
  },

  onAddLifelist: function(event) {
    wx: wx.navigateTo({
      url: '../create/create',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 显示全部内容
  showAll: function(event) {
    this.setData({
      allList: this.getAllList(),
      curTag: '全部'
    })
  },

  // 显示当前标签分类下的内容
  showCateContent: function(event) {

    var tag = event.detail.tag;
    // console.log(tag);

    var allList = this.data.allList;

    //  数据不够xin.....
    if (allList[tag]) {

      // console.log(allList[tag]);
      this.setData({
        lifeList: allList[tag],
        curTag: tag
      })
    } else {
      this.setData({
        lifeList: [],
        curTag: tag
      })
    }
  },

  // 完成状态切换
  onChangeDoneState: function (event) {

    var id = event.detail.id;
    var state = event.detail.state;
    // console.log('done', id, state);
    state = state == 0 ? 2 : 0;

    // 上次存储的信息
    var OriginList = this.data.OriginList;
    OriginList.objs[id].state = state;

    wx.setStorageSync('lifeList', OriginList);
    this.initLifeList(this.data.curTag);
  },

  // 显示详情，显示本条会隐藏上一条
  // onShowEdit: function(event) {
  //   var lastId = event.detail.lastId;

  //   console.log('main-lstid',lastId)
  // },

  // 删除
  onDelete: function(event) {

    var id = event.detail.id;
    var lifeList = wx.getStorageSync('lifeList');
    delete lifeList.objs[id];
    wx.setStorageSync('lifeList', lifeList);
    this.initLifeList(this.data.curTag);
  },

  // 修改编辑结束
  onEditEnd: function(event) {

    console.log('editEnd',event.detail);
    var id = event.detail.id;

    var lifeList = wx.getStorageSync('lifeList');
    lifeList.objs[id].title = event.detail.title;
    lifeList.objs[id].desc = event.detail.desc;
    
    wx.setStorageSync('lifeList', lifeList);
    this.initLifeList(this.data.curTag);
  },

  // 清除数据
  clearAllData: function(e) {
    this.clearStorage();
    this.setData({
      lifeList: [],
      OriginList: [],
      allList: {},
      tags: [],
      // curTag: '全部',
      bHideDesc: true,
      strText: '显示描述详情',
      bNew: true
    });
    this.initTags();
    this.initLifeList();
  }
})