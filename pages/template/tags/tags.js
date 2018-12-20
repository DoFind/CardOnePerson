Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tags: {
      type: Array,
      value: []
    },
    curTag: {
      type: String,
      value: '全部'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 显示全部内容
    showAll: function (event) {
      this.triggerEvent('showAll');
    },

    // 显示当前标签分类下的内容
    showCateContent: function (event) {
      let tag = event.currentTarget.dataset.tag;
      this.triggerEvent('showCateContent', {tag: tag});
    }
  }
})
