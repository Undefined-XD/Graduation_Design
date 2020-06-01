// pages/quoteRecommend/quoteRecommend.js
import Notify from '@vant/weapp/notify/notify'

const app = getApp()
const serverIP = app.globalData.serverIP

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 报价推荐类型（精准、基本）
    recommendType: '',
    // 推荐报价价格
    totalMoney: 0,
    // 基本预设
    baseOptions: {},
    // 其他单价预设
    otherUnitPrices: {},
    // 客户基本需求（来自于本地报价缓存）
    customerOptions: {},
    // 封面用纸中英文对照
    paperNameMap: {
      铜版纸: 'ArtPaper',
      哑粉纸: 'MattArtPaper',
      双胶纸: 'OffsetPaper'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地缓存中的最新报价数据选项
    const customerOptions = wx.getStorageSync('latestQuote')
    console.log(customerOptions)
    this.setData({
      customerOptions,
      recommendType: options.recommendType
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    const eventChannel = that.getOpenerEventChannel()

    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      // 基本报价则需要发送请求，从数据库获取其他参数
      if (data.recommendType === 'normal') {
        // 获取其他单价参数
        wx.request({
          // url: 'http://localhost:8080?table=other_unit_prices&manipulation=retrieve&mark=other_unit_prices_retrieve',
          url: `${serverIP}?table=other_unit_prices&manipulation=retrieve&mark=other_unit_prices_retrieve`,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log('res', res.data[0])
            that.setData({
              otherUnitPrices: res.data[0]
            })
          },
          fail: function (err) {
            console.log(err)
            Notify({
              message: '请求参数失败，请重新进入该页面！',
              duration: 0
            })
          }
        })
      } else {
        // console.log('data', data)
        that.setData({
          otherUnitPrices: data
        })
      }

      wx.request({
        // url: 'http://localhost:8080?table=Recommend_options&manipulation=retrieve&mark=normal_retrieve',
        url: `${serverIP}?table=Recommend_options&manipulation=retrieve&mark=normal_retrieve`,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // console.log(res.data[0])
          that.setData({
            baseOptions: res.data[0]
          })
        },
        fail: function (err) {
          console.log(err)
          Notify({
            message: '请求参数失败，请重新进入该页面！',
            duration: 0
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    const thatData = this.data
    const recommendType = thatData.recommendType

    setTimeout(() => {
      const allOptions = {
        // 纸张预设参数
        cover: thatData.paperNameMap[thatData.baseOptions.cover] + thatData.baseOptions.cover_weight,
        content: thatData.paperNameMap[thatData.baseOptions.content] + thatData.baseOptions.content_weight,
        // 客户自定义的参数
        albums: thatData.customerOptions.albums,
        pages: thatData.customerOptions.pages,
        foldTimes: thatData.customerOptions.foldTimes,
        bookBinding: thatData.customerOptions.bookBinding,
        delivery: thatData.customerOptions.delivery,
        // 其他参数
        ps: thatData.otherUnitPrices.exposure || thatData.otherUnitPrices['PS版'],
        film: thatData.otherUnitPrices.film || thatData.otherUnitPrices['菲林'],
        layout: thatData.otherUnitPrices.layout || thatData.otherUnitPrices['设计费'],
        proofing: thatData.otherUnitPrices.proofing || thatData.otherUnitPrices['打样费']
      }

      wx.request({
        // url: `http://localhost:8080?manipulation=calculate&quoteType=${recommendType}`,
        url: `${serverIP}?manipulation=calculate&quoteType=${recommendType}`,
        data: {
          allOptions
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            totalMoney: res.data * 100
          })
        },
        fail: function (err) {
          console.log(err)
          Notify({
            message: '报价计算错误，请重新进入该页面！',
            duration: 0
          })
          that.setData({
            totalMoney: '???'
          })
        }
      })

      console.log(allOptions)
    }, 1000)
  },

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
