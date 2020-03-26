// pages/quoteResult/quoteResult.js
// 使用 npm 第三方时间格式化模块
const time = require('time-formater')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverPaper: '',
    contentPaper: '',
    foldTimes: '',
    pages: '',
    albums: '',
    bookBinding: '',
    delivery: '',
    quoteTime: '',
    totalPrices: ''
  },

  // 返回报价选项页
  jumpToQuoteOptions: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前时间
    const now = time().format('YYYY-MM-DD HH:mm:ss')
    // 获取缓存好的最近一次报价选项
    const quoteOptions = wx.getStorageSync('latestQuote')
    // 报价选项绑定到当前页面
    this.setData({
      coverPaper: quoteOptions.coverPaper,
      contentPaper: quoteOptions.contentPaper,
      foldTimes: quoteOptions.foldTimes,
      pages: quoteOptions.pages,
      albums: quoteOptions.albums,
      bookBinding: quoteOptions.bookBinding,
      delivery: quoteOptions.delivery,
      quoteTime: now,
      totalPrices: quoteOptions.totalPrices
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
