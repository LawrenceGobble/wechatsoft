// pages/sign/sign.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
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