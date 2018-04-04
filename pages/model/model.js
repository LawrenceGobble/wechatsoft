// pages/model/model.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: [],
  },
  usemodel: function (e) {
    console.log(e);
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; 
    var data = that.data.models[e.target.id];
    prevPage.setData({
      title: data.addr,
      addr: data.addr,
      publisher: data.publisher,
      islocal: data.islocal,
      latitude: data.laititude,
      longitude: data.longitude,
      messagebox: data.signmessagenames
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.server_add + "/api/meeting/getmodel",
      data: {
        openid: wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res);
        that.setData({
          models: res.data.models
        })
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