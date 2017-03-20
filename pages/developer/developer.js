Page({
    data:{
        name: "签到打卡",
        desc: "为活动发起人提供创建、管理、组织签到打卡活动的工具",
        area: "办公、票务"
    },

    // 从main进来用wx.navigateBack
    // 从其他页用wx.redirectTo
    toMain(){
        wx.redirectTo({
          url: '../main/main'
        })
    },

    // 推荐给朋友
    toFriend(){
        
    }
})