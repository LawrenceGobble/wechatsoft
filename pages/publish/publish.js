// pages/publish/publish.js 
/*  */
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    publisher: '',
    addr: '',
    latitude: null,
    longitude: null,
    islocal: 0,
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray2: null,
    dateTime2: null,
    startYear: 2000,
    endYear: 2050,

    messagebox: ['姓名'],
    signmessagecount: 1
  },
  usemodel: function(e){
    wx.navigateTo({
      url: '../model/model',
    })
  },
  localinfo: function (e) {
    wx.showModal({
      content: '用于记录会议地点的经纬度，在会议XX米内签到才能签到成功！',
      showCancel: false,
      success: function (res) {
      }
    });
  },
  changetitle: function (e) {
    var title = e.detail.value;
    this.setData({
      title: title
    })
  },
  changepublisher: function (e) {
    var publisher = e.detail.value;
    this.setData({
      publisher: publisher
    })
  },
  changeaddr: function (e) {
    var addr = e.detail.value;
    this.setData({
      addr: addr
    })
  },
  switchChange: function (res) {
    if (res.detail.value == true) {
      this.testlocation();
    }
    else {
      this.setData({
        islocal: 0,
      });
    }
  },
  addmessage: function () {
    var mb = this.data.messagebox;
    if (this.data.signmessagecount >= 5) {
      wx.showModal({
        content: '最多5个字段',
        showCancel: false,
        success: function (res) {
        }
      });
    }
    else {
      var signmessagecount = this.data.signmessagecount + 1;
      mb.push('');
      this.setData({
        messagebox: mb,
        signmessagecount: signmessagecount
      });
    }
  },
  changemessage: function (e) {
    //console.log(e);
    var index = e.currentTarget.id;
    var message = e.detail.value;
    var messagebox = this.data.messagebox;
    messagebox[index] = message;
    //console.log(messagebox);
    this.setData({
      messagebox: messagebox
    });
  },
  delemessage: function (e) {
    //console.log(e);
    var mb = this.data.messagebox;
    if (mb.length <= 1) {
      wx.showModal({
        content: '至少一个字段',
        showCancel: false,
        success: function (res) {
        }
      });
    }
    else {
      var index = e.currentTarget.id;
      var tb = [];
      for (var i = mb.length - 1; i > index; i--) {
        tb.push(mb.pop());
      }
      mb.pop();
      for (var i = tb.length - 1; i >= 0; i--) {
        mb.push(tb.pop());
      }
      this.setData({
        messagebox: mb,
        signmessagecount: mb.length,
      });
    }
  },

  formSubmit: function (e) {
    var that = this;
    var signmessagestatus = 0;
    for (var i = 0; i < that.data.messagebox.length; i++) {
      if (that.data.messagebox[i] == '') {
        break;
      }
      signmessagestatus++;
    }
    if (that.data.title == '' || that.data.publisher == '' || that.data.addr == '' || signmessagestatus < that.data.messagebox.length) {
      wx.showModal({
        content: '会议信息或签到信息有空白',
        showCancel: false,
        success: function (res) {
        }
      });
    }
    else {
      console.log(that.data);
      var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var dateTime = that.data.dateTime;
      var dateTime2 = that.data.dateTime2;
      var title = that.data.title;
      var publisher = that.data.publisher;
      var addr = that.data.addr;
      var longitude = that.data.longitude;
      var latitude = that.data.latitude;
      var islocal = that.data.islocal;
      var signmessagecount = that.data.signmessagecount;
      var signmessage = that.data.messagebox;
      var starttime = obj1.dateTimeArray[0][dateTime[0]] + "-" + obj1.dateTimeArray[1][dateTime[1]] + "-" + obj1.dateTimeArray[2][dateTime[2]] + " " + obj1.dateTimeArray[3][dateTime[3]] + ":" + obj1.dateTimeArray[4][dateTime[4]] + ":" + obj1.dateTimeArray[5][dateTime[5]];
      var endtime = obj2.dateTimeArray[0][dateTime2[0]] + "-" + obj2.dateTimeArray[1][dateTime2[1]] + "-" + obj2.dateTimeArray[2][dateTime2[2]] + " " + obj2.dateTimeArray[3][dateTime2[3]] + ":" + obj2.dateTimeArray[4][dateTime2[4]] + ":" + obj2.dateTimeArray[5][dateTime2[5]];
      //console.log(starttime+" "+endtime);
      var openid = wx.getStorageSync("openid");
      wx.request({
        url: app.data.server_add + "/api/meeting/publish",
        method: 'POST',
        data: {
          title: title,
          publisher: publisher,
          addr: addr,
          starttime: starttime,
          endtime: endtime,
          openid: openid,
          longitude: longitude,
          latitude: latitude,
          islocal: islocal,
          signmessagecount: signmessagecount,
          signmessage: signmessage
        },
        success: function (res) {
          console.log(res);
          if (res.data.success == true) {
            wx.showModal({
              content: '签到码为：' + res.data.code,
              showCancel: false,
            });
          }
          else {
            wx.showModal({
              content: '发布失败',
              showCancel: false,
            });
          }
        }
      })
    }
  },

  testlocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          islocal: 1
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    //var lastArray = obj11.dateTimeArray.pop();
    //var lastTime = obj11.dateTime.pop();
    this.setData({
      dateTime: obj1.dateTime,
      dateTimeArray: obj1.dateTimeArray,
      dateTime2: obj2.dateTime,
      dateTimeArray2: obj2.dateTimeArray,
    });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime2(e) {
    this.setData({ dateTime2: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr
    });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray2: dateArr
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})