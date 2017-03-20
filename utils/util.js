
// 年-月-日 时：分：秒
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 年月日
function formatTime1(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

// 时分
function formatTime2(date) {

  var hour = date.getHours()
  var minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

// 时分秒  
function formatTime3(date) {

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

// 补0
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 当前月有几天
function getDays(y, m) {

  var d = 31;
  if (m == 2) {
    // 闰年判断： 是400的倍数  或者  是4的倍数
    if (y % 400 == 0 || y % 4 == 0)
      d = 29;
    else
      d = 28;
  }
  else if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11)
    d = 30;

  return d;
}

// 从开始到结束总共有多少天
function getSumDays(begin, end) {

  if (begin.indexOf(' ') != -1 && end.indexOf(' ') != -1) {
    return getSumDays1(begin, end);
  }
  else {
    return getSumDays2(begin, end);
  }
}
// 形参格式  '2017-01-01 12:20'
function getSumDays1(begin, end) {

  var days = 0;
  if (begin.length > 0 && end.length > 0) {

    var temp1 = begin.split(' ');
    var temp2 = end.split(' ');

    var arr1 = temp1[0].split('-');
    var arr2 = temp2[0].split('-');

    var beginD = new Date(arr1[0], arr1[1] - 1, arr1[2]).getTime();
    var endD = new Date(arr2[0], arr2[1] - 1, arr2[2]).getTime();

    days = (endD - beginD) / (1000 * 60 * 60 * 24) + 1;
    // console.log("天数："+days);
  }
  return days;
}
// 形参格式  '2017-01-01'
function getSumDays2(begin, end) {

  var days = 0;
  if (begin.length > 0 && end.length > 0) {

    var arr1 = begin.split('-');
    var arr2 = end.split('-');

    var beginD = new Date(arr1[0], arr1[1] - 1, arr1[2]).getTime();
    var endD = new Date(arr2[0], arr2[1] - 1, arr2[2]).getTime();

    days = (endD - beginD) / (1000 * 60 * 60 * 24) + 1;
    // console.log("天数："+days);
  }
  return days;
}

// 未来时间  date的n天后是哪天？
function formatFutureTime(date, n) {

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  day += n;

  var days = getDays(year, month);
  if (day > days) {
    day -= days;
    month += 1;
    if (month > 12) {
      month -= 12;
      year += 1;
    }
  }

  return [year, month, day].map(formatNumber).join('-')
}

// 活动状态判定   用标准时间比较
// 未开始 0 now < begin  
// 进行中 1 begin <= now <= end
// 已结束 2 now > end 
// 异常情况 -1 
function retActivityState(begin, end) {

  var now = formatTime(new Date());
  var state = -1;

  var t1 = compareCalendar(now, begin);
  var t2 = compareCalendar(now, end);

  // console.log(begin + "   " + end);
  // console.log(now)
  // console.log(t1 + "   " + t2);
  if (t1 == 0) {
    state = 0;
  }
  else if (t1 > 0 && t2 == 0) {
    state = 1;
  }
  else if (t2 > 0) {
    state = 2;
  }

  return state;
}

// 时间比较 用标准时间比较
// 原则上传过来的形参其中一个是now 
// 可以直接使用，而不需要两次转换时间格式
// 不过为了统一，先这样吧
// -1 形参格式不对   0  小于   1  等于   2  大于
function compareCalendar(begin, end) {

  if (begin.indexOf(' ') != -1 && end.indexOf(' ') != -1) {
    return compareTime(begin, end);
  }
  else {
    return compareDate(begin, end);
  }
}

// 形参格式 '2017-01-01 12:20'
function compareTime(begin, end) {

  var state = -1;
  if (begin.length > 0 && end.length > 0) {

    var temp1 = begin.split(' ');
    var temp2 = end.split(' ');

    var arr11 = temp1[0].split('-');
    var arr12 = temp1[1].split(':');

    var arr21 = temp2[0].split('-');
    var arr22 = temp2[1].split(':');

    // 不计秒
    // now 有秒，但是create创建是没有保存秒
    var beginD = new Date(arr11[0], arr11[1], arr11[2], arr12[0], arr12[1]).getTime();
    var endD = new Date(arr21[0], arr21[1], arr21[2], arr22[0], arr22[1]).getTime();

    if (beginD > endD)
      state = 2;
    else if (beginD == endD)
      state = 1;
    else
      state = 0;
  }
  //console.log(typeof(new Date())); // object
  // console.log(typeof(beginD));  // number
  // console.log(beginD + "   " + endD);
  // console.log(state)
  return state;
}

// 形参格式 '2017-01-01'
function compareDate(begin, end) {

  var state = -1;
  if (begin.length > 0 && end.length > 0) {

    var arr1 = begin.split('-');
    var arr2 = end.split('-');

    var beginD = new Date(arr1[0], arr1[1] - 1, arr1[2]).getTime();
    var endD = new Date(arr2[0], arr2[1] - 1, arr2[2]).getTime();

    if (beginD > endD)
      state = 2;
    else if (beginD == endD)
      state = 1;
    else
      state = 0;
  }
  return state;
}

// 签到
function signIn(id, begin) {

  var arr = wx.getStorageSync('signin' + id);
  var now = formatTime(new Date());
  var tt = now.split(' ');
  var data = [];
  var flag = false;
  var gap = -1;

  if (arr.length) {
    arr.forEach((item) => {

      if (item.date == tt[0]) {
        flag = true;
      }
      data.push(item);
    })
  }
  if (flag == false) {
    gap = getSumDays1(begin, now);
    // console.log("util gap:" + gap);
    var temp = {};
    temp.date = tt[0];
    temp.time = tt[1];
    temp.index = gap;
    data.push(temp);
    wx.setStorageSync('signin' + id, data);
  }

  var msg = flag ? '今日已打卡' : '打卡成功';
  wx.showToast({
    title: msg,
    icon: 'success',
    duration: 1000
  })
  return gap;
}

// 创建活动时间验证
function checkTime(begin, end) {

  var now = formatTime(new Date());
  var msg = '';

  if (compareCalendar(begin, end) == 2)
    msg = '结束时间比开始时间小啦'
  else if (compareCalendar(now, end) == 2)
    msg = '噢，这都是过去啦'
  else if (compareCalendar(now, begin) == 2)
    msg = '当前时间大于开始时间啦'

  return msg
}

module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  formatFutureTime: formatFutureTime,
  retActivityState: retActivityState,
  signIn: signIn,
  getSumDays: getSumDays,
  checkTime: checkTime
}
