// pages/quoteHistory/historyList/historyList.js
import Notify from '@vant/weapp/notify/notify'

const timeFormaterFn = require('time-formater')
const app = getApp()
const serverIP = app.globalData.serverIP

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 报价记录类型
    categories: [
      { text: '所有报价', value: 'all' },
      { text: '基本报价', value: 'normal' },
      { text: '精准报价', value: 'accurate' }
    ],
    // 报价记录排序
    order: [
      { text: '时间降序', value: 'DESC' },
      { text: '时间升序', value: 'ASC' }
    ],
    // 报价记录类型值
    categoryValue: 'all',
    // 报价记录排序值
    orderValue: 'DESC',
    // 渲染列表
    renderListArr: [],
    // 所有报价记录列表
    allListArr: [],
    // 基本报价记录列表
    normalListArr: [],
    // 精准报价记录列表
    accurateListArr: []
  },

  // 报价历史目录回调函数
  categoryChange: function (e) {
    // 拼接要用以渲染显示的列表名
    const listName = `${e.detail}ListArr`

    this.setData({
      renderListArr: this.data[listName],
      categoryValue: e.detail
    })
  },

  // 报价历史排序回调函数
  orderChange: function (e) {
    this.httpRequest(e.detail)
  },

  // 跳转历史记录详情页面
  jumpToHistoryDetail: function (e) {
    // 获取当前点击的历史记录信息概况
    const queryItem = e.currentTarget.dataset.item

    wx.navigateTo({
      url: '/pages/quoteHistory/historyDetail/historyDetail',
      success: function (res) {
        console.log('jumpToHistoryDetail success.')
        res.eventChannel.emit('acceptDataFromOpenerPage', queryItem)
      },
      fail: () => console.log('jumpToHistoryDetail fail.')
    })
  },

  /**
   * 时间戳字符串格式化
   * @param {object} item 报价记录数据对象
   */
  timeFormat: function (item) {
    // 获取时间戳字符串
    const dateStampStr = item.time
    // 将时间戳字符串还原回数值类型
    const dateStamp = Number(dateStampStr)
    // 将字符串格式化
    const date = timeFormaterFn(dateStamp).format('MM月DD日 HH:mm')
    // 重置数据对象
    item.timeFormatted = date

    return item
  },

  /**
   * 报价类型区分
   * @param {object} item 报价记录数据对象
   */
  categoryDevided: function (item) {
    if (item.quote_type === 'normal') {
      this.data.normalListArr.push(item)
    } else {
      this.data.accurateListArr.push(item)
    }
  },

  httpRequest: function (orderType = 'DESC') {
    const that = this

    wx.request({
      // url: `http://localhost:8080?table=Information_brief&manipulation=retrieve&order=${orderType}&mark=history_retrieve`,
      url: `${serverIP}?table=Information_brief&manipulation=retrieve&order=${orderType}&mark=history_retrieve`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 引用时间格式化函数
        const timeFormatFn = that.timeFormat
        // 引用历史记录分类函数
        const categoryDevidedFn = that.categoryDevided

        // 遍历修改数据对象的时间格式
        const formattedListArr = res.data.map(timeFormatFn)

        // 赋值格式化后的报价记录
        that.setData({
          allListArr: formattedListArr,
          normalListArr: [],
          accurateListArr: []
        })

        // 遍历区分不同报价类型，分别进行存储用以列表渲染
        formattedListArr.forEach(categoryDevidedFn, that)

        const categoryValue = that.data.categoryValue
        const currentListArr = that.data[`${categoryValue}ListArr`]

        that.setData({
          renderListArr: currentListArr
        })
      },
      fail: function (err) {
        console.log(err)
        Notify({
          message: '报价记录加载错误，请重新进入该页面！',
          duration: 0
        })
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
    // 默认加载降序排列的报价历史记录
    this.httpRequest('DESC')
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
