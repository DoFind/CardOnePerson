
var util = require("../../utils/util.js");
var state = ['未开始', '进行中', '已结束'];
var btnState = ['已经报名', '打卡', '已经结束'];

Page({

    data: {

        // 打卡活动信息
        id: 1,
        title: '',
        beginTime: '',
        endTime: '',
        content: '',

        // 活动状态
        state: '',
        btnState: '',
        disabled: false,

        // 是 创建者 or 参与者
        bCreater: 'block',
        bParticipant: 'none',

        // 打卡详情
        doDays: 0,
        sumDays: 0,
        activity: [],
        punch: [{
            date: '2017-02-01',
            data: [{
                name: '茶茶',
                time: '12:59:00',
                src: '../../img/giraffe.png'
            }, {
                name: '夏目',
                time: '16:33:00',
                src: '../../img/giraffe.png'
            },],
            show: 'block'
        },{
            date: '2017-02-02',
            data: [{
                    name: 'CC',
                    time: '12:59:00',
                    src: '../../img/giraffe.png'
                }
            ],
            show: 'none'
        }],

        // 列表显示状态
        detailShow: 'none',
        recordShow: 'none',
        yourShow: 'block',
        punchShow: 'none',

        detailArrow: 'arrow-right',
        recordArrow: 'arrow-right',
        yourArrow: 'arrow-down',
        punchArrow: 'arrow-right',

    },

    // 加载初始化
    onLoad(e) {
        initData(this, e.id);
    },

    // 设置分享
    onShareAppMessage() {
        return {
            title: '我发起了一个活动，邀你参加~',
            path: '/page/detail'
        }
    },

    // 创建者结束活动
    stopActivity() {

        var msg = '结束活动将删除数据，确认退出？';
        Exit(this, msg);
    },

    // 参与者退出活动
    exitActivity() {

        var msg = '退出活动将删除数据，确认退出？';
        Exit(this, msg);
    },

    // 这里签到。签到成功刷新当前页面
    signIn() {

        var id = this.data.id;
        var begin = this.data.beginTime;
        var gap = util.signIn(id, begin);
        console.log("ret gap:" + gap);
        if (gap > 0) {
            setSignInfo(this, id, gap);
        }
    },
    // 下拉列表点击 show  hide
    showDetail(e) {

        var show = this.data.detailShow == 'block' ? 'none' : 'block';
        var arrow = show == 'none' ? 'arrow-right' : 'arrow-down';
        this.setData({
            detailShow: show,
            detailArrow: arrow
        })
    },
    showRecord() {

        var show = this.data.recordShow == 'block' ? 'none' : 'block';
        var arrow = show == 'none' ? 'arrow-right' : 'arrow-down';
        this.setData({
            recordShow: show,
            recordArrow: arrow
        })
    },
    showYours() {

        var show = this.data.yourShow == 'block' ? 'none' : 'block';
        var arrow = show == 'none' ? 'arrow-right' : 'arrow-down';
        this.setData({
            yourShow: show,
            yourArrow: arrow
        })
    },
    showPunch(){

        var show = this.data.activityShow == 'block' ? 'none' : 'block';
        var arrow = show == 'none' ? 'arrow-right' : 'arrow-down';
        this.setData({
            punchShow: show,
            punchArrow: arrow
        })   
    },

    // 打卡记录内容 show hide
    showPunchItem(e){
    
        var date = e.currentTarget.dataset.date;
        var arr = this.data.punch;
        var data = [];

        if(arr.length){
            arr.forEach((item)=>{
                if(item.date == date){
                    item.show = item.show == 'block'?'none':'block';
                }
                
                data.push(item);
            })
            this.setData({
                punch: data
            })
        }
    }
})


// 初始化页面的各种数据
function initData(page, id) {

    var arr = wx.getStorageSync('activity');
    var iState = -1;
    if (arr.length) {
        arr.forEach((item) => {

            if (item.id == id) {

                var beginTime = item.beginDate + " " + item.beginTime;
                var endTime = item.endDate + " " + item.endTime;
                var content = "简介：" + item.content + "\n地址：" + item.address + "\n开始时间：" + beginTime + "\n结束时间：" + endTime;
                iState = util.retActivityState(beginTime, endTime);

                page.setData({
                    id: item.id,
                    title: item.title,
                    beginTime: beginTime,
                    endTime: endTime,
                    sumDays: util.getSumDays(item.beginDate, item.endDate),
                    content: content,
                    state: state[iState],
                    btnState: btnState[iState],
                    disabled: iState != 1
                })
                return;
            }
        })
    }
    setSignInfo(page, id, -1, iState);
    setPunchInfo(page);
}

// 个人打卡一览
function setSignInfo(page, id, gap, iState) {

    // 活动到目前为止进行了多少天
    if (gap < 0) {
        gap = (iState == 2) ? util.getSumDays(page.data.beginTime, page.data.endTime)
            : util.getSumDays(page.data.beginTime, util.formatTime(new Date()));

        console.log("gap没有默认值，计算：" + gap);
    }

    if (gap > 0) {

        var data = [];
        for (var i = 0; i < gap; i++) {

            var t = {
                index: -1,
                active: '',
                time: ''
            };
            data.push(t);
        }

        // console.log("initData");
        // console.log(data);

        var arr2 = wx.getStorageSync('signin' + id);
        var len = arr2.length;
        if (len) {

            arr2.forEach((item) => {

                var i = item.index - 1;
                data[i].index = item.index;
                data[i].active = 'active';
                data[i].time = item.date + ' ' + item.time;
            })
        }

        page.setData({
            doDays: len,
            activity: data
        })
        // console.log("data");
        // console.log(data);
    }
}
// 打卡详情
function setPunchInfo(page) {

}


// 删除活动，
// 依据活动id  删除该id下的所有数据
// 单人的，删除自己的数据
// 多人的，仅删除自己的并结束活动？
function Exit(page, msg) {

    wx.showModal({
        title: '提示',
        content: msg,
        showCancel: true,

        success: function (res) {
            if (res.confirm) {

                DeleteActivity(page.data.id);
                // 活动被销毁，返回main
                wx.navigateBack({
                    url: '../main/main'
                })
            }
        }
    })
}
function DeleteActivity(id) {

    // Del 这个活动 
    var arr = wx.getStorageSync('activity');
    var data = [];
    if (arr.length) {
        arr.forEach((item) => {
            if (item.id != id) {
                data.push(item);
            }
        })
        wx.setStorageSync('activity', data);
    }

    // Del 这个活动下的打卡数据
    wx.removeStorageSync('signin' + id);
}
