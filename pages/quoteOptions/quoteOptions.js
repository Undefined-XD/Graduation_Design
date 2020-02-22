// pages/main/quote.js
import Dialog from '@vant/weapp/dialog/dialog'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示提交信息时的遮罩层
    overlay: false,
    // 选项被选中后的颜色
    selectedColor: 'linear-gradient(to right, #4bb0ff, #6149f6)',
    // 纸张类型，供渲染使用
    paperArr: ['铜版纸', '牛皮纸', '瓦楞纸'],
    // 开数类型，供渲染使用
    foldTimesArr: [4, 8, 16, 32],
    // 装订类型，供渲染使用
    bookBindingArr: ['无线胶装', '锁线胶装'],
    // 寄送方式，供渲染使用
    deliveryArr: ['自提', '寄送'],
    // 当前已选项数据
    options: {
      // 已选纸张类型
      paper: '铜版纸',
      // 已选开数
      foldTimes: 16,
      // 已选内文页数
      pages: 100,
      // 已选册数
      albums: 100,
      // 已选装订类型
      bookBinding: '无线胶装',
      // 已选寄送类型
      delivery: '自提'
    }
  },

  // 选择纸张类型
  checkPaper: function (e) {
    let paperType = e.target.dataset.paper
    this.setData({
      ['options.paper']: paperType
    })
  },
  // 选择开数
  checkFoldTimes: function (e) {
    let foldTimes = e.target.dataset.foldtimes
    this.setData({
      ['options.foldTimes']: foldTimes
    })
  },
  // 选择页数
  checkPages: function (e) {
    let pages = e.detail
    this.setData({
      ['options.pages']: pages
    })
  },
  // 选择册数
  checkAlbums: function (e) {
    let albums = e.detail
    this.setData({
      ['options.albums']: albums
    })
  },
  // 选择装订类型
  checkBookBinding: function (e) {
    let bookBinding = e.target.dataset.bookbinding
    this.setData({
      ['options.bookBinding']: bookBinding
    })
  },
  // 选择寄送类型
  checkDelivery: function (e) {
    let delivery = e.target.dataset.delivery
    this.setData({
      ['options.delivery']: delivery
    })
  },
  // 显示遮罩层
  showOverlay: function () {
    Dialog.confirm({
      // context: this,
      title: '提示',
      message: '确认提交信息？'
    }).then(() => { 
      let that = this.data.options
      // 将最近一次查询记录的选项存入缓存，供报价单展示选项信息
      wx.setStorageSync('latestQuote', {
        paper: that.paper,
        foldTimes: that.foldTimes,
        pages: that.pages,
        albums: that.albums,
        bookBinding: that.bookBinding,
        delivery: that.delivery
      })
      // 跳转报价结果
      wx.navigateTo({
        url: '../quoteResult/quoteResult'
      })
    }).catch(() => { })
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