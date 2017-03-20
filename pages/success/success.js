Page({
    data: {
        id: 0,
        title: "跑步",
        beginTime: "2017-02-24 12:00"
    },

    onLoad(e){
        initData(this, e.id)
    },

    // 设置分享
    onShareAppMessage() {
        return {
            title: '我发起了一个活动，邀你参加~',
            path: '/page/success'
        }
    },

    toDetail(){
        wx.redirectTo({
          url: '../detail/detail?id=' + this.data.id
        })
    },

    // redirectTo会导致重新打开一个main，也就是两个main
    // navigateBack可以，关闭当前页，并返回主页
    toMain(){
        wx.navigateBack({
          url: '../main/main'
        })
    }
})

function initData(page, id){
    var arr = wx.getStorageSync('activity');
    if(arr.length){
        arr.forEach((item)=>{

            if(item.id == id){
                page.setData({
                    id: id,
                    title: item.title,
                    beginTime: item.beginDate +' '+ item.beginTime
                })
            }
        })
    }
}