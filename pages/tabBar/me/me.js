// pages/me/me.js
import Toast from '@vant/weapp/toast/toast'

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
    Toast.success({
      message: '感谢您的评分',
      forbidClick: true,
      duration: 1000
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
