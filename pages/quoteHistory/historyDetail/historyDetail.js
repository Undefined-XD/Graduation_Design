// pages/quoteHistory/historyDetail/historyDetail.js
import Dialog from '@vant/weapp/dialog/dialog'

const app = getApp()
const serverIP = app.globalData.serverIP

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 概况信息
    headerInfo: {
      // 默认报价类型
      quote_type: 'normal',
      // 默认报价金额
      quote_amount: 0
    },
    // 印刷信息标题
    paperInfo: [
      '封面信息', '内页信息', '纸张开数', '画册页数',
      '画册总数', '装订类型', '寄送类型'
    ],
    // 参数信息标题
    paperParams: ['版面费', '胶片费', '晒版费', '打样费'],
    // 报价信息
    quoteInfo: {}
  },

  deleteHistory: function () {
    const that = this
    console.log(this.data.quoteInfo.time)

    Dialog.confirm({
      message: '请确认是否删除该记录？'
    }).then(() => {
      wx.request({
        url: `${serverIP}?manipulation=delete`,
        data: {
          time: that.data.quoteInfo.time
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data === 'ok') {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }).catch(() => {
      // on cancel
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        headerInfo: data
      })

      wx.request({
        // url: `http://localhost:8080?table=Information_brief&manipulation=retrieve&mark=union_retrieve&unionOption=${data.time}`,
        url: `${serverIP}?table=Information_brief&manipulation=retrieve&mark=union_retrieve&unionOption=${data.time}`,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.dir(res.data[0])
          that.setData({
            quoteInfo: res.data[0]
          })
        }
      })
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
