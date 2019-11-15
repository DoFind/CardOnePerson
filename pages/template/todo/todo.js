// pages/template/todo/todo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: JSON,
      value: {},

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bHideDesc: true,
    bHideEdit: true,
    focus: false,
    // originTitle: ''
  },

  // 生命周期函数
  lifetimes: {
    // ready: function() {
    //   this.setData({
    //     originTitle: this.data.item.title
    //   })
    // },

    // show: function(){
    //   console.log('show');
      
    // }
  },

  pageLifetimes: {
    hide() {
      // 页面被隐藏
      this.setData({
        bHideDesc: true,
        bHideEdit: true,
        focus: false,
      })
    },
    resize(size) {
      // 页面尺寸变化
      console.log('resize');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 显示详情，编辑按钮
    onShowDesc: function(event) {

      var bHide = !this.data.bHideDesc;

      this.setData({
        bHideDesc: bHide,
        bHideEdit: bHide ? true : this.data.bHideEdit
      })
    },

    // 显示编辑框
    onShowEdit: function(event) {
      var bHide = !this.data.bHideEdit;
      var focus = !bHide;
      var lastId = this.data.lastId;

      // if (!!lastId) {
      //   var myEventDetail = {
      //     lastId: lastId
      //   };
      //   this.triggerEvent('onShowEdit', myEventDetail, {});
      // }
      
      this.setData({
        bHideEdit: bHide,
        focus: focus,
        // lastId: event.currentTarget.dataset.id
      })
    },

    // 切换状态
    onChangeDoneState: function(event) {

      var dataset = event.currentTarget.dataset;

      var myEventDetail = {
        id: dataset.id,
        state: dataset.state
      };
      this.triggerEvent('onChangeDoneState', myEventDetail, {})
    },

    // 删除
    onDelete: function(event) {

      // console.log('1:', event.currentTarget.dataset.id);
      var myEventDetail = {
        id: event.currentTarget.dataset.id
      };
      this.triggerEvent('onDelete', myEventDetail, {})
    },

    // 提交编辑表单
    onEditEnd: function(event) {

      this.setData({
        bHideDesc: true,
        bHideEdit: true,
        focus: false
      })

      var value = event.detail.value;
      var title = value.title.trim();

      if (title.length > 0) {
        var myEventDetail = {
          id: value.id,
          title: title,
          desc: value.desc.trim()
        }
        this.triggerEvent('onEditEnd', myEventDetail, {})

      } else {
        wx: wx.showToast({
          title: '标题不可为空',
          image: '/img/icon/warning.png'
        })
      }
    }
  }
})