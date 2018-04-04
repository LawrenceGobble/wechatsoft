// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words: [],
    windowHeight: 0,//获取屏幕高度  
    refreshHeight: 0,//获取高度  
    refreshing: false,//是否在刷新中  
    refreshAnimation: {}, //加载更多旋转动画数据  
    clientY: 0,//触摸时Y轴坐标  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
        console.log("屏幕高度: " + res.windowHeight)
      }
    })

  },

  upper: function () {
    console.log("下拉了....")
    //获取用户Y轴下拉的位移  

    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    updateRefreshIcon.call(this);
    var _this = this;

    wx.request({
      url: 'http://api.avatardata.cn/ChengYu/Search?key=77f072d28eb141c8b6dda145ca364b92&keyWord=' + word,

      complete: function (res) {
        if (res.data.reason == 'Succes') {
          setTimeout(function () {
            _this.setData({
              words: res.data.result
            })
          }, 2000)
        }
        setTimeout(function () {
          _this.setData({
            refreshing: false
          })
        }, 2500)
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

function updateRefreshIcon() {
  var deg = 0;
  var _this = this;
  console.log('旋转开始了.....')
  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function () {
    if (!_this.data.refreshing)
      clearInterval(timer);
    animation.rotateZ(deg).step();//在Z轴旋转一个deg角度  
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
} 