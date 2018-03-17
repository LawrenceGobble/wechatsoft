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
    signmessages: []

  },
  changemessage: function(e){
    //console.log(e);
    var sm = this.data.signmessages;
    if(sm.length < e.target.id){
      sm.push(e.detail.value);
    }else{
      sm[e.target.id-1] = e.detail.value;
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
    //console.log(context);
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
        meetingid: meetingid
      },
      success: function(res){
        console.log(res);
        that.setData({
          hiddenmodalput: true
        })
      }
    })
  },

  SubmitSign: function(e){
    var code = e.detail.value.code;
    var that = this;
    //console.log(e);
    wx.request({
      url: app.data.server_add + "/api/meeting/signcode",
      method: 'get',
      data: {
        code: code
      },
      success: function (res) {
        console.log(res);
        that.setData({
          meetingid: res.data.meetingid,
          signmessagenames: res.data.signmessagenames,
          hiddenmodalput: false,
        });

      }
    })
  },

  showAction: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['相机', '拍摄'],
      success: function (res) {
        var _this= that;
        if (!res.cancel) {
          if(res.tapIndex == 0){
            wx.chooseImage({
              count: 9, // 最多可以选择的图片张数，默认9
              sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
              sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
              success: function (res) {
                _this.setData({
                  src: res.tempFilePaths
                });
                var tempFilePaths = res.tempFilePaths;
                //console.log(tempFilePaths);
                wx.uploadFile({
                  url: app.data.server_add+'/api/upload/upload_image', //仅为示例，非真实的接口地址
                  filePath: tempFilePaths[0],
                  name: 'file',
                  formData: {
                    'user': 'test'
                  },
                  success: function (res) {
                    console.log(res);
                    //do something
                  }
                })
              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })

          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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