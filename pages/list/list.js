
// 注意注意！！ 不是单纯的require，引入并赋值给变量

var util = require("../../utils/util.js");

Page({
    data:{
        list:[
            {
                // content:"hello",
                // time:Date.now(),
                // id:1
            }
        ]
    },
    // 页面加载完成触发一次，仅一次
    onLoad(){
        // var arr = wx.getStorageSync('logs');
        initData(this);
    },
    // 页面重新显示时触发
    onShow(){
        initData(this);
    },

    edit(e){
        // e  事件对象
        var id = e.currentTarget.dataset.id;

        wx.navigateTo({
          url: '../add/add?id=' + id
        })
    },

    add(){
        console.log('add')

        wx.navigateTo({
          url: '../add/add'
        })
    }
})

function initData(page){
    var arr = wx.getStorageSync('txt');
    if(arr.length){
        arr.forEach((item, i) => {

            var t = new Date(Number(item.time));
            item.time = util.formatTime(t);
        })

        page.setData({
            list:arr
        })
    }
}

// setData      D a t a
// new Date     D a t e