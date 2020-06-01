// pages/quoteResult/quoteResult.js
// 使用 npm 第三方时间格式化模块
import Notify from '@vant/weapp/notify/notify'

const time = require('time-formater')
const app = getApp()
const serverIP = app.globalData.serverIP

Page({

  /**
   * 页面的初始数据
   */
  data: {
    annotation: '',
    coverPaper: '',
    contentPaper: '',
    foldTimes: '',
    pages: '',
    albums: '',
    bookBinding: '',
    delivery: '',
    quoteTime: '',
    totalPrices: '',
    totalPricesFormated: '',
    allParams: '',
    coverWeight: '',
    contentWeight: '',
    // 推荐报价类型
    recommendType: ''
  },

  // 跳转查询备注页
  jumpToAnnotation: function (e) {
    wx.navigateTo({
      url: '/pages/quoteAnnotation/quoteAnnotation'
    })
  },

  // 返回报价选项页
  jumpToQuoteOptions: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  // 跳转推荐报价页
  jumpToQuoteRecommend: function (e) {
    const that = this.data
    const allParams = that.allParams
    const recommendType = that.recommendType

    wx.navigateTo({
      url: `/pages/quoteRecommend/quoteRecommend?recommendType=${recommendType}`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', allParams)
      }
    })
  },

  // 保存报价查询记录
  saveQuoteResult: function () {
    const that = this
    const thatData = this.data
    // 成功通知
    Notify({ type: 'success', message: '保存成功！' })

    const items = {
      timeStamp: `'${new Date().valueOf().toString()}'`,
      customer_name: `'${thatData.annotation || '未定义'}'`,
      quoteType: `'${thatData.recommendType}'`,
      quoteAmount: thatData.totalPrices,
      cover: `'${thatData.coverPaper}'`,
      coverWeight: thatData.coverWeight,
      content: `'${thatData.contentPaper}'`,
      contentWeight: thatData.contentWeight,
      foldTimes: that.foldTimesFormated(thatData.foldTimes),
      pages: thatData.pages,
      albums: thatData.albums,
      bookBinding: `'${thatData.bookBinding}'`,
      delivery: `'${thatData.delivery}'`,
      paperClass: `'${that.paperClassFormated(thatData.foldTimes)}'`,
      design: thatData.allParams.layout,
      film: thatData.allParams.film,
      exposure: thatData.allParams.exposure,
      proof: thatData.allParams.proofing
    }
    console.log(items)

    that.httpRequestToSave(items)
  },

  // 从开数字符串中提取纸张类型（大度：A | 正度：B）
  paperClassFormated: function (foldTimesStr) {
    let classType = foldTimesStr.slice(0, 2)

    switch (classType) {
      case '大度':
        classType = 'A'
        break
      case '正度':
        classType = 'B'
        break
    }

    return classType
  },

  // 从开数字符串中提取开数
  foldTimesFormated: function (foldTimesStr) {
    return foldTimesStr.match(/\d+/g)[0]
  },

  // 保存查询记录
  httpRequestToSave: function (items) {
    wx.request({
      // url: 'http://localhost:8080?manipulation=create',
      url: `${serverIP}?manipulation=create`,
      data: {
        allOptions: items
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
        Notify({
          message: '报价记录保存错误，请重新进行保存！',
          duration: 0
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const recommendType = options.recommendType
    console.log(recommendType)
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
      totalPrices: quoteOptions.totalPrices,
      totalPricesFormated: quoteOptions.totalPrices.toLocaleString(),
      coverWeight: quoteOptions.coverWeight,
      contentWeight: quoteOptions.contentWeight,
      recommendType: recommendType
    })

    if (this.data.totalPrices === '???') {
      Notify({
        message: '报价计算错误，请返回上级页面重新计算！',
        duration: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
      // 设置对应的推荐报价的所属类型（基本报价的推荐报价，精准报价的推荐报价）
      that.setData({
        allParams: data
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const annotaionStorage = wx.getStorageSync('annotation')

    this.setData({
      annotation: annotaionStorage
    })
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
