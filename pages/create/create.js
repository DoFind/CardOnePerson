var util = require('../../utils/util.js');
// var app = getApp();
// 数据这么写 “ 名：JSON数据 ”
// 函数可以这么写 “ 名称：匿名函数 ”
Page({
    data: {
        title: '',
        content: '坚持打卡~',
        address: 'Here'
        // id: 0,
        // beginDate: '2016-09-01',
        // beginTime: '00:00',
        // endDate: '2016-09-03',
        // endTime: '23:59',
    },

    // 加载时初始化一下  时间 
    // 如果要获取当前位置信息，需要请求
    onLoad() {

        var now = new Date(Number(Date.now()));
        // console.log("now:"+now);
        var bDate = util.formatTime1(now);
        // console.log("bDate:"+bDate);

        // console.log("测试开始")
        // console.log(new Date());
        // // 1488356068968
        // console.log("Date.now():"+Date.now());
        // console.log("Number(Date.now()):"+Number(Date.now()));
        // // Wed Mar 01 2017 16:14:28 GMT+0800 (中国标准时间)
        // console.log("now:"+now);
        // // 2017-03-01
        // console.log("fotmatTime:"+bDate);
        // console.log("测试结束")

        var bTime = util.formatTime2(now);
        // console.log("bTime:"+bTime);

        var eDate = util.formatFutureTime(now, 3);
        // console.log("eDate:"+eDate);

        this.setData({
            beginDate: bDate,
            beginTime: bTime,
            endDate: eDate,
            endTime: "23:59"
        })
    },

    // 设置分享
    onShareAppMessage() {
        return {
            title: '快来创建属于你的打卡活动吧~',
            path: '/page/create'
        }
    },


    // 两种绑定函数的写法。
    // 时间设定
    // 怎么都觉得这里有些重复
    bindDateChange(e) {
        console.log("beginDate:" + e.detail.value)
        this.setData({
            beginDate: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        console.log("beginTime:" + e.detail.value)
        this.setData({
            beginTime: e.detail.value
        })
    },
    bindDateChange2: function (e) {
        console.log("endDate:" + e.detail.value)
        this.setData({
            endDate: e.detail.value
        })
    },
    bindTimeChange2: function (e) {
        console.log("endTime:" + e.detail.value)
        this.setData({
            endTime: e.detail.value
        })
    },


    // 标题，简介，地址设定
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
    addressChange(e) {

        this.setData({
            address: e.detail.value
        })
    },

    // 创建新活动。创建成功跳转至创建成功页
    createActivity() {
        console.log("createActivity");

        
        // 活动名称自然不可为空
        if(this.data.title.length == 0){

            wx.showModal({
                title: 'Hey, 别急',
                content: '请先给活动起个名字',
                showCancel: false
            })
            return;
        }

        // 先验证时间的合理性
        // 结束时间 > 开始时间 > now
        var begin = this.data.beginDate +' '+ this.data.beginTime;
        var end = this.data.endDate +' '+ this.data.endTime;
        var msg = util.checkTime(begin, end)
        if(msg.length){
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
        // var data = wx.getStorageSync('activity');
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
            url: '../success/success?id=' + id
        })
    }
})
