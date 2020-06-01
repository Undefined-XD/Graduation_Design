// pages/index/index.js
import Notify from '@vant/weapp/notify/notify'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: ['/src/img/p1.jpg', '/src/img/p2.jpg', '/src/img/p3.jpg', '/src/img/p4.jpg']
  },

  /**
   * 跳转报价页面
   */
  jumpToQuoteOptions: function () {
    wx.navigateTo({
      url: '/pages/quoteOptions/quoteOptions',
      success: function () {
        console.log('jumpToQuote success')
      },
      fail: function (err) {
        console.log('jumpToQuote fail: ', err)
        Notify('跳转失败，请检查跳转路径是否正确！')
      }
    })
  },
  jumpToQuoteDetailOptions: function () {
    wx.navigateTo({
      url: '/pages/quoteDetailOptions/quoteDetailOptions',
      success: function () {
        console.log('jumpToQuoteDetail success')
      },
      fail: function (err) {
        console.log('jumpToQuoteDetail fail: ', err)
        Notify('跳转失败，请检查跳转路径是否正确！')
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
