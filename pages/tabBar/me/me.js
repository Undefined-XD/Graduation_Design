// pages/me/me.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 权限
    authority: 'admin',
    // 用户头像 url
    avatarURL: '',
    // 用户名称
    userName: '',
    // 用户评分
    rateValue: 5,
    // 评分范围
    rateRange: 5,
    // 是否显示评分栏
    showRate: false
  },

  // 是否显示评分栏
  showRate: function (e) {
    this.setData({
      showRate: !this.data.showRate
    })
  },

  // 用户打分
  checkRate: function (e) {
    this.setData({
      rateValue: e.detail
    })
  },

  http: function (e) {
    console.log('http 请求')
    wx.request({
      url: 'http://localhost:8080/',
      method: 'get',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log('http res:', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const appData = app.globalData
    const avatarURL = appData.userInfo.avatarUrl
    const userName = appData.userInfo.nickName

    this.setData({
      avatarURL,
      userName
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