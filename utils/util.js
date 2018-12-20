var arrTaskState = ['未开始', '进行中', '已结束'];
var arrBtnState = ['尚未开始', '打卡', '已经结束'];
var arrTaskColor = ['c-coming', 'c-doing', 'c-completed'];

// 按钮文字
function getBtnText(iTaskState, bPunched) {
  var text = '';
  if (iTaskState == 1) {
    text = bPunched ? '已打卡' : '打卡';
  } else {
    text = arrBtnState[iTaskState];
  }
  return text;
}

// 任务状态
function getTaskState(iTaskState) {
  return arrTaskState[iTaskState];
}

// 任务状态对应颜色class
function getTaskColorClass(iTaskState) {
  return arrTaskColor[iTaskState];
}

// 創建任務

// date 之后的 n天
// 返回：结束时间
function formatFutureTime(date, n) {

  n = parseInt(n);

  if (n <= 0) {
    // 返回格式化的当前时间
    return formatDate(date);

  } else {
    // 返回未来 n 天之后的日期
    var newD = retDateObj(date);
    var dd = newD.getTime();
    dd += n * (1000 * 60 * 60 * 24);
    newD.setTime(dd);
    return formatDate(newD);
  }
}


// 年-月-日 时：分：秒
function formatTime(date) {

  var year, month, day, hour, minute, second;

  if (typeof date == 'object') {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();

  } else {

    var temp = date.split(' ');
    var dd = temp[0].split('-');
    var tt = temp[1].split(':');

    year = dd[0];
    month = dd[1];
    day = dd[2];

    hour = tt[0] ? tt[0] : 0;
    minute = tt[1] ? tt[1] : 0;
    second = tt[2] ? tt[2] : 0;
  }

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 年-月-日
function formatDate(date) {

  var year, month, day;

  if (date.getFullYear) {
    year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate()
  } else {

    var date = date.split(' ')[0].split('-');
    year = parseInt(date[0]);
    month = parseInt(date[1]);
    day = parseInt(date[2]);
  }

  return [year, month, day].map(formatNumber).join('-')
}

// 补0
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 时间间隔：多少天
function getSumDays(begin, end) {

  var days = 0;

  begin = retDateObj(begin);
  end = retDateObj(end);


  if (begin && end) {
    begin = begin.getTime();
    end = end.getTime();

    days = (end - begin) / (1000 * 60 * 60 * 24) + 1;

  }
  // console.log("getSumDays 间隔天数：" + days);
  return days;
}


// 活动状态判定   用标准时间比较，只比较年月日，不涉及时分秒
// 未开始 0 now < begin  
// 进行中 1 begin <= now <= end
// 已结束 2 now > end 
// 异常情况 -1 
function retTaskState(begin, end) {

  var state = -1;
  var now = retDateObj(new Date());
  begin = retDateObj(begin);
  end = retDateObj(end);

    // console.log(begin);
    // console.log(now);
    // console.log(end);

  if (begin && end) {

    now = now.getTime();
    begin = begin.getTime();
    end = end.getTime();

    if (now < begin) {
      state = 0;
    } else if (now <= end) {
      state = 1;
    } else {
      state = 2;
    }
  }
  // console.log("util - retTaskState" + state);
  return state;
}

// 返回时间对象   str -> object
function retDateObj(date) {

  if (typeof date == 'object') {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  } else {
    var obj = {};

    if (date.length > 0) {
      var date = date.split(' ')[0].split('-');
      obj = new Date(date[0], date[1] - 1, date[2]);
    }
    return obj;
  }
}


// 今天是否已打卡
function retPunched(id, arrRecord) {

  var arrRecord = arrRecord ? arrRecord : wx.getStorageSync('signin' + id).arrRecord;
  var re = false;

  if (arrRecord && arrRecord.length > 0) {
    var len = arrRecord.length;
    for (var i = len - 1; i >= 0; i--) {
      if (formatDate(arrRecord[i].date) == formatDate(new Date())) {
        re = true;
        break;
      }
    }
  }
  return re;
}

// 返回连续打卡信息
function retserialInfo(records) {

  var maxTemp = 0;
  var max = 0;
  var temp = 0;
  var medal = 0;

  for (var i = 0, len = records.length; i < len; i++) {
    if (records[i]) {

      maxTemp += 1;
      if (maxTemp > max) {
        max = maxTemp;
      }
      temp += 1;
      if (temp == 7) {
        temp = 0;
        medal += 1;
      }
    } else {
      maxTemp = 0;
      temp = 0;
    }
  }

  return {
    serialMaxDays: max,
    medalCount: medal
  }
}

// 打卡
function signIn(id, begin) {

  var now = new Date();
  var data = wx.getStorageSync('signin' + id);

  // 每次打卡详细记录 data.arrRecord
  var arrRecord = data.arrRecord ? data.arrRecord : [];

  // 为防止插入数据错乱，再次验证。
  if (retPunched(id, records)){
    wx.showToast({
      title: '已打卡',
      icon: 'success',
      duration: 1000
    })
    return false;
  }

  // 打卡活动已持续天数 data.lastedDays
  var lastedDays = getSumDays(begin, formatDate(now));

  if (lastedDays > 0) {

    // 打卡情况总览 date.reconds
    var records = data.records ? data.records : [];
    // 已打卡次数
    var punchCount = data.punchCount ? data.punchCount : 0;

    // 打卡时间记录
    arrRecord.push({
      date: formatTime(now),
      index: lastedDays
    });

    // 打卡总览记录
    records[lastedDays - 1] = true;

    // 获取连续打卡信息
    var serialInfo = retserialInfo(records);

    // 保存数据
    var data2 = {
      arrRecord: arrRecord,
      records: records,
      punchCount: punchCount + 1,
      serialMaxDays: serialInfo.serialMaxDays,
      medalCount: serialInfo.medalCount
    }
    wx.setStorageSync('signin' + id, data2);

    wx.showToast({
      title: '打卡成功',
      icon: 'success',
      duration: 1000
    })
  }
  return true;
}


// 创建活动时间验证， 只验证 年月日
function checkTime(begin, end) {

  var now = formatDate(new Date());
  var msg = '';

  if (compareDate(begin, end) == 2)
    msg = '结束时间比开始时间小啦'
  else if (compareDate(now, end) == 2)
    msg = '噢，这都是过去啦'
  else if (compareDate(now, begin) == 2)
    msg = '当前时间大于开始时间啦'
  else if (compareDate(now, begin) == -1)
    msg = '数据乱了...'

  return msg
}

// 比较两个时间的大小
// 2 大于  1 等于  0 小于
function compareDate(begin, end) {

  var state = -1;

  begin = retDateObj(begin);
  end = retDateObj(end);


  if (begin && end) {
    begin = begin.getTime();
    end = end.getTime();

    if (begin > end) {
      state = 2;
    } else if (begin === end) {
      state = 1;
    } else {
      state = 0;
    }
  }
  return state;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatFutureTime: formatFutureTime,
  retTaskState: retTaskState,
  signIn: signIn,
  getSumDays: getSumDays,
  checkTime: checkTime,
  retPunched: retPunched,
  getBtnText: getBtnText,
  getTaskState: getTaskState,
  getTaskColorClass: getTaskColorClass
}