// pages/mypage/mypage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 页面配置 */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    // 签到、会议数据
    signs: [],
    meetings: [],
    //弹窗
    hiddenmodalput: true,
    signmessagenames: [],
    signmessages: [],
    signid: 0,
    //搜索框1
    inputShowed: false,
    inputVal: "",
    //搜索框2
    inputShowed2: false,
    inputVal2: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //获取我的签到会议信息
    wx.request({
      url: app.data.server_add + "/api/sign/meetingsign",
      method: 'get',
      data: {
        openid: wx.getStorageSync("openid"),
      },
      success: function (res) {
        console.log(res);
        that.setData({
          signs: res.data.signs,
          meetings: res.data.meetings
        });
      }
    });
  },
  setmodel: function (e) {
    var that = this;
    var meetings = that.data.meetings;
    //console.log(meetings[e.target.id]);
    wx.request({
      url: app.data.server_add + '/api/meeting/setmodel',
      method: 'post',
      data: {
        id: meetings[e.target.id].id,
      },
      success: function (res) {
        if (res.data.success == true) {
          if (meetings[e.target.id].ismodel == '0') {
            meetings[e.target.id].ismodel = '1';
          }
          else if (meetings[e.target.id].ismodel == '1') {
            meetings[e.target.id].ismodel = '0';
          }
          that.setData({
            meetings: meetings
          });
        }
      }
    })
  },
  upper: function (e) {
    var that = this;
    wx.request({
      url: app.data.server_add + "/api/sign/meetingsign",
      method: 'get',
      data: {
        openid: wx.getStorageSync("openid"),
        searchkey: that.data.inputVal,
        searchkey2: that.data.inputVal2,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          signs: res.data.signs,
          meetings: res.data.meetings
        });
      }
    });
  },

  //点击签到卡
  bindsign: function (e) {
    var that = this;
    //console.log(e);
    wx.request({
      url: app.data.server_add + "/api/meeting/signmessages",
      method: 'get',
      data: {
        signid: e.currentTarget.id,
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          signmessagenames: res.data.signmessagenames,
          signmessages: res.data.signmessages,
          signid: e.currentTarget.id,
          hiddenmodalput: false,
        })
      }
    })
  },
  cancel: function () {
    this.setData({
      signid: null,
      signmessages: null,
      hiddenmodalput: true
    });
  },
  changemessage: function (e) {
    //console.log(e);
    var sm = this.data.signmessages;
    sm[e.currentTarget.id - 1].context = e.detail.value;
    this.setData({
      signmessages: sm
    })
    //console.log(this.data.signmessages);
  },
  confirm: function (e) {
    var that = this;
    console.log(that.data.signmessages);
    var sm = that.data.signmessages;
    var signmessages = [];
    for (var i = 0; i < sm.length; i++) {
      signmessages.push(sm[i].context);
    }
    wx.request({
      url: app.data.server_add + "/api/sign/updatesignmessage",
      method: 'post',
      data: {
        signid: that.data.signid,
        signmessages: signmessages,
        hiddenmodalput: true,
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  //点击会议卡
  bindmeeting: function (e) {
    var that = this;
    console.log(e);
    wx.navigateTo({
      url: '../meeting/meeting?id=' + e.currentTarget.id,
    })
  },
  //我的签到&会议菜单
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 搜索框
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this;
    that.setData({
      inputVal: e.detail.value
    });
    wx.request({
      url: app.data.server_add + "/api/sign/searchsign",
      method: 'post',
      data: {
        openid: wx.getStorageSync("openid"),
        searchkey: that.data.inputVal
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          signs: res.data.signs,
        });
      }
    })
  },
/**
   * 搜索框2
   */
  showInput2: function () {
    this.setData({
      inputShowed2: true
    });
  },
  hideInput2: function () {
    this.setData({
      inputVal2: "",
      inputShowed2: false
    });
  },
  clearInput2: function () {
    this.setData({
      inputVal2: ""
    });
  },
  inputTyping2: function (e) {
    var that = this;
    that.setData({
      inputVal2: e.detail.value
    });
    wx.request({
      url: app.data.server_add + "/api/meeting/searchmeeting",
      method: 'post',
      data: {
        openid: wx.getStorageSync("openid"),
        searchkey2: that.data.inputVal2
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          meetings: res.data.meetings,
        });
      }
    })
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