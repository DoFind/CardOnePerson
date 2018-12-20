// pages/template/todo/todo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: JSON,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bHideDesc: true,
    bHideEdit: true,
    focus: false,
    originTitle: ''
  },

  // 生命周期函数
  lifetimes: {
    ready: function () {
      this.setData({
        originTitle: this.data.item.title
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 显示详情，编辑按钮
    onShowDesc: function (event) {

      var bHide = !this.data.bHideDesc;

      this.setData({
        bHideDesc: bHide
      })
    },

    // 显示编辑框
    onShowEdit: function (event) {
      var bHide = !this.data.bHideEdit;
      var focus = !bHide;

      this.setData({
        bHideEdit: bHide,
        focus: focus
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

    // 编辑结束
    onEditEnd: function(event) {

      this.setData({
        bHideDesc: true,
        bHideEdit: true,
        focus: false
      })

      var originTitle = this.data.originTitle;
      var title = event.detail.value.trim();

      if (originTitle == title ){
        return;
      }
      this.setData({
        originTitle: title
      })
      var myEventDetail = {
        id: event.currentTarget.dataset.id,
        title: title
      }
      this.triggerEvent('onEditEnd', myEventDetail, {})
    }
  }
})