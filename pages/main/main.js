
// 注意注意！！ 不是单纯的require，引入并赋值给变量

var util = require("../../utils/util.js");
var state = ['未开始', '进行中', '已结束'];
var btnState = ['已经报名', '打卡', '已经结束'];

Page({
    data: {
        list: [
            // {
            //     id: 1,
            //     title: '',
            //     state: '',
            //     btnState: '',
            //     disabled: true,
            //     beginTime: '',
            //     endTime: '',
            //     beginShow: true
            // }
        ]
    },
    // 页面加载完成触发一次，仅一次
    onLoad() {
        // var arr = wx.getStorageSync('logs');
        setNavigationBar();
        initData(this);
    },
    // 页面重新显示时触发
    onShow() {
        initData(this);
    },

    // 设置分享
    onShareAppMessage() {
        return {
            title: '互相监督，一起打卡吧',
            path: '/page/main'
        }
    },



    // 转到打卡详情页面
    edit(e) {
        // e  事件对象
        // e.currentTarget  当前活动对象，list中的某项
        var id = e.currentTarget.dataset.id;
        // console.log('edit--id:'+id)
        wx.navigateTo({
            url: '../detail/detail?id=' + id
        })
    },

    signIn(e) {

        // 先验证活动是否在进行中

        var begin = e.currentTarget.dataset.begin;

        var id = e.currentTarget.dataset.id;
        var gap = util.signIn(id, begin);

        if (gap > 0) {
            wx.navigateTo({
                url: '../detail/detail?id=' + id
            })
        }
    },

    // 打卡，图片打卡 打卡完成跳转至打卡详情页面
    signInImg(e) {
        // console.log("main 打卡")
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                // console.log("图片路径："+tempFilePaths)

                // 成功跳转  这里的id是自定义属性哦
                var id = e.currentTarget.dataset.id;
                wx.navigateTo({

                    url: '../detail/detail?id=' + id
                })
            }
        })
    },

    // 添加新打卡任务
    add() {
        wx.navigateTo({
            url: '../create/create'
        })
    }
})

// 登录时，返回所有参与的活动（自己创建的+参与别人的） 
// 保存在本地缓存中
// 有修改或者别的，修改远程数据库，但是数据仍读取本地
function initData(page) {

    var arr = wx.getStorageSync('activity');
    var data = [];
    var data0 = [];
    var data2 = [];
    if (arr.length) {

        arr.forEach((item, i) => {

            // console.log("initData--i:"+i);
            // console.log(item);

            var begin = item.beginDate + " " + item.beginTime;
            var end = item.endDate + " " + item.endTime;
            var iState = util.retActivityState(begin, end);
            // console.log('main--state:'+iState);

            // 定义变量要赋值，明确变量类型，不然赋值会不成功
            var d = {};
            d.id = item.id;
            d.title = item.title;
            d.beginTime = begin;
            d.endTime = end;
            d.state = state[iState];
            d.btnState = btnState[iState];
            d.disabled = iState != 1;
            d.beginShow = iState == 0 ? true : false;

            switch (iState) {
                case 0:
                    data0.push(d);
                    break;
                case 1:
                    data.push(d);
                    break;
                case 2:
                    data2.push(d);
                    break;
            }
        })

        // 排序: 进行中，未开始，已结束
        data = data.concat(data0);
        data = data.concat(data2);
    }

    // 如果setData写在if里，onShow调用的时候如果arr为空，list将不能被重新赋值。
    // so 删除最后一个活动返回时会保留显示最后一个活动，因为之前的List残存，又没有被重新赋值
    page.setData({
        list: data
    })

    // console.log(data);
}

// 设置导航条信息
function setNavigationBar() {

    // 导航条标题
    // wx.setNavigationBarTitle({
    //     title: '打卡主页'
    // })

    // 当前页显示导航条加载动画  转圈圈，不会主动停
    // wx.showNavigationBarLoading()

    // 隐藏加载动画
    // wx.hideNavigationBarLoading()


    // 获取用户信息
    wx.getUserInfo({
        success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女 
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            // console.log(res)
        }
    })
}

// setData      D a t a
// new Date     D a t e