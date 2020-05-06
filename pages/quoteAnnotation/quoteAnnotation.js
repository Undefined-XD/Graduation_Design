// pages/quoteAnnotation/quoteAnnotation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 备注内容
    annotation: '',
    // 备注字数
    annotationLength: 0
  },

  // 备注字数计算器
  contextCounter: function (e) {
    // 去除开头空白字符
    const annotationTrimLeft = e.detail.value.trimLeft()
    // 末尾空白字符最多为2个
    const annotationTrimRight = annotationTrimLeft.replace(/\s{3,}$/, '  ')
    // 获取最终的字符个数
    const annotationLength = annotationTrimRight.length

    this.setData({
      annotation: annotationTrimRight,
      annotationLength: annotationLength
    })
  },

  // 取消备注并返回
  cancelAndReturn: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  // 保存备注并返回
  confirmAndReturn: function () {
    // 保存备注到本地缓存
    const annotation = this.data.annotation
    wx.setStorageSync('annotation', annotation)

    // 调用返回方法
    this.cancelAndReturn()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const annotationStorage = wx.getStorageSync('annotation')

    if (annotationStorage.length) {
      this.setData({
        annotation: annotationStorage,
        annotationLength: annotationStorage.length
      })
    }
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
