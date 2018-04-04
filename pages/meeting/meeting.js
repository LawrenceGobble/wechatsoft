// pages/meeting/meeting.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 页面配置 */
    winWidth: 0,
    winHeight: 0,
    /** 页面数据 */
    meeting: null,
    signmessagename: null,
    signmessages: null,
    /** modal */
    hiddenmodalput: true,
    mailaddr: null,
    /** 加载 */
    loading: 0,
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    wx.request({
      url: app.data.server_add + "/api/meeting/getmeeting",
      data: {
        id: options.id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          meeting: res.data.meeting,
          signmessagename: res.data.signmessagename,
          signmessages: res.data.signmessages
        })
      }
    })
  },
  geimailaddr: function (e) {
    console.log(e);
    this.setData({
      mailaddr: e.detail.value
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  sendmail: function (e) {
    var that = this;
    var meetingid = that.data.meeting.id;
    var mailaddr = that.data.mailaddr
    console.log(e)
    wx.request({
      url: app.data.server_add + "/api/meeting/mailmeeting",
      method: 'post',
      data: {
        meetingid: meetingid,
        mailaddr: mailaddr,
        openid: wx.getStorageSync('openid'),
      },
      success: function (res) {
        //console.log(res);
        if (res.data.success) {
          that.setData({
            hiddenmodalput: true
          });
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 3000
          });
        }
        else{
            that.setData({
              hiddenmodalput: true
            });
            wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 3000
            });
        }
      }
    })
  },
  download: function (e) {
    var that = this;
    var meetingid = that.data.meeting.id;
    var mailaddr = that.data.mailaddr
    wx.showActionSheet({
      itemList: ['下载至本地', '发送到邮箱'],
      success: function (res) {
        var _this = that;
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.request({
              url: app.data.server_add + "/api/meeting/exportmeeting",
              method: "post",
              data: {
                meetingid: meetingid,
                mailaddr: mailaddr,
                openid: wx.getStorageSync('openid'),
              },
              success: function(res){
                console.log(res);
                wx.showLoading({
                  title: "下载中",
                });
                const downloadTask = wx.downloadFile({
                  url: res.data.exceladdr, //仅为示例，并非真实的资源
                  success: function (res) {
                    var filePath = res.tempFilePath
                    wx.openDocument({
                      filePath: filePath,
                      success: function (res) {
                        console.log('打开文档成功')
                        wx.hideLoading();
                      }
                    })
                  }
                })
                downloadTask.onProgressUpdate((res) => {
                  that.setData({
                    loading: res.progress
                  })
                  console.log('下载进度', res.progress)
                  console.log('已经下载的数据长度', res.totalBytesWritten)
                  console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)

                })

                //downloadTask.abort() // 取消下载任务
              }
            })
          }
          else if (res.tapIndex == 1) {
            _this.setData({
              hiddenmodalput: false
            })
          }
        }
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