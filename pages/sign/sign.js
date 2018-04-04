// pages/sign/sign.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    hiddenmodalput: true,
    signmessagenames: [],
    meetingid: 0,
    signmessages: [],
    latitude: 0,
    longitude: '',

    /** 页面配置 */
    winWidth: 0,
    winHeight: 0,

  },
  changemessage: function (e) {
    //console.log(e);
    var sm = this.data.signmessages;
    if (sm.length < e.target.id) {
      sm.push(e.detail.value);
    } else {
      sm[e.target.id - 1] = e.detail.value;
    }
    this.setData({
      signmessages: sm
    });
    //console.log(sm);
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    var that = this;
    var meetingid = that.data.meetingid;
    var openid = wx.getStorageSync('openid');
    var signmessages = that.data.signmessages;
    var signmessagenames = that.data.signmessagenames;
    var context = [];
    var signmessagenameid = [];
    var snumber = [];

    for (var i = 0; i < signmessages.length; i++) {
      context.push(signmessages[i]);
      signmessagenameid.push(signmessagenames[i].id);
      snumber.push(signmessagenames[i].number);
    }
    //console.log();
    //console.log(signmessagenameid);
    //console.log(snumber);
    wx.request({
      url: app.data.server_add + "/api/sign/sign",
      method: 'post',
      data: {
        count: signmessages.length,
        context: context,
        signmessagenameid: signmessagenameid,
        snumber: snumber,
        openid: openid,
        meetingid: meetingid,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          hiddenmodalput: true
        });
        wx.showModal({
          title: res.data.mesg,
          content: '在我的页面能查看/修改签到信息',
        });
      }
    })
  },

  SubmitSign: function (e) {
    var code = e.detail.value.code;
    var that = this;
    //console.log(e);

    var latitude;
    var longitude;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        //console.log(res);
        latitude = res.latitude;
        longitude = res.longitude;
        //console.log(latitude);
        var now = new Date().getTime();
        console.log(new Date(),now);
        wx.request({
          url: app.data.server_add + "/api/meeting/signcode",
          method: 'get',
          data: {
            code: code,
            latitude: latitude,
            longitude: longitude,
            openid: wx.getStorageSync('openid'),
            now: now,
          },
          success: function (res) {
            console.log(res);
            if (res.data.success == true) {
              that.setData({
                meetingid: res.data.meetingid,
                signmessagenames: res.data.signmessagenames,
                hiddenmodalput: false,
              });
            }
            else{
              wx.showModal({
                title: '签到失败',
                content: res.data.mesg,
              })
            }
          }
        })

      },
    })

  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
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