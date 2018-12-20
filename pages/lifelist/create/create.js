var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    originTags: {},
    bHideAddPanel: true,
    hHideOpPanel: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 读取 tags
    this.initTags();
  },


  initTags: function() {
    var data = wx.getStorageSync('lifeListTags');
    var tags = data ? data : app.globalData.g_tags;


    var arr = [];
    for (var i=0,len=tags.length; i<len; i++){
      arr.push({
        name: tags[i],
        value: tags[i],
        checked: false
      });
    }
    this.setData({
      originTags: tags,
      tags: arr
    })
  },

  // 添加一个任务
  onSubmit: function(event) {
    var value = event.detail.value;
    
    if (value.title.trim() === '') {
      wx.showToast({
        title: '标题不可为空',
        image: '/img/icon/warning.png'
      })
      return;
    }
    if (value.tags.length == 0) {
      wx.showToast({
        title: '标签不可为空',
        image: '/img/icon/warning.png'
      })
      return;
    }
      
    // console.log(value);

    // 所有的放到一个数组中  lifeList
    var lifeList = wx.getStorageSync('lifeList');

    var id;
    if (lifeList) {
      id = lifeList.maxId +1;
    } else {
      id = 1;
      lifeList = {};
      lifeList.objs = {};
    }
    
    // 当前递增 id 保存一下
    lifeList.maxId = id;

    lifeList.objs[id] = {
      id: id,
      tag: value.tags,
      title: value.title,
      desc: value.desc,
      createTime: new Date(),
      state: 0
    }
    wx.setStorageSync('lifeList', lifeList);

    wx.navigateBack({});
  },

  checkboxChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.tags.length; i++) {
      if (checked.indexOf(this.data.tags[i].name) !== -1) {
        changed['tags[' + i + '].checked'] = true
      } else {
        changed['tags[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },

  // 添加一个 新的标签
  onAddTag: function(event) {
    // console.log('显示panel啊 ');
    this.setData({
      bHideAddPanel: false
    })
  },

  onAddToTags: function(event) {

    var tag = event.detail.value.addTag.trim();

    // console.log('add tags:',tag);

    if(tag.length == 0){
      wx.showToast({
        title: '标签不能为空',
        image: '/img/icon/warning.png'
      });
      return;
    }

    if (this.data.originTags.join('#').indexOf(tag) < 0) {

      // !!! 是个数组，，，预计是个 json 对象来的
      // 初始化需求敲定一下
      var tags = this.data.tags;
      tags.push({
        name: tag,
        value: tag,
        checked: false
      });
      var originTags = this.data.originTags;
      originTags.push(tag);

      // !!! 不使用 setData 虽然数据会更新，但是可能不会更新显示啊...坑么？
      this.setData({
        bHideAddPanel: true,
        originTags: originTags,
        tags: tags
      })

      wx.setStorageSync('lifeListTags', this.data.originTags);

    } else {
      // !!! icon 显示的还是默认的 success
      wx.showToast({
        title: '该标签已存在',
        image: '/img/icon/warning.png'
      })
    }
  }

  // 编辑标签....
})