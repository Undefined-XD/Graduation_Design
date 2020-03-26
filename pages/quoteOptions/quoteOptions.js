// pages/main/quote.js
import Dialog from '@vant/weapp/dialog/dialog'

const util = require('../../functions/utils2')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示提交信息时的遮罩层
    overlay: false,
    // 选项被选中后的颜色
    selectedColor: 'linear-gradient(to right, #4bb0ff, #6149f6)',
    // 封面纸张类型，供渲染使用
    coverPaperArr: ['铜版纸', '哑粉纸', '双胶纸'],
    // 内页纸张类型，供渲染使用
    contentPaperArr: ['铜版纸', '哑粉纸', '双胶纸'],
    // 开数类型，供渲染使用
    foldTimesArr: [
      ['大度64开', '大度32开', '大度16开', '大度8开'],
      ['正度64开', '正度32开', '正度16开', '正度8开']
    ],
    // 装订类型，供渲染使用
    bookBindingArr: ['无线胶装', '锁线胶装'],
    // 寄送方式，供渲染使用
    deliveryArr: ['自提', '寄送'],
    // 当前已选项数据
    options: {
      // 已选封面纸张类型
      coverPaper: '铜版纸',
      // 已选内页纸张类型
      contentPaper: '铜版纸',
      // 已选开数
      foldTimes: '大度16开',
      // 已选内文页数
      pages: 100,
      // 已选册数
      albums: 100,
      // 已选装订类型
      bookBinding: '无线胶装',
      // 已选寄送类型
      delivery: '自提'
    },
    // 封面用纸中英文对照
    coverPaperNameMap: {
      铜版纸: 'ArtPaper157g',
      哑粉纸: 'MattArtPaper157g',
      双胶纸: 'OffsetPaper100g'
    },
    // 内页用纸中英文对照
    contentPaperNameMap: {
      铜版纸: 'ArtPaper128g',
      哑粉纸: 'MattArtPaper128g',
      双胶纸: 'OffsetPaper80g'
    }
  },

  // 选择纸张类型
  checkPaper: function (e) {
    const isCover = e.target.dataset.cover
    const paperType = e.target.dataset.paper

    if (isCover === 'true') {
      this.setData({
        'options.coverPaper': paperType
      })
    } else {
      this.setData({
        'options.contentPaper': paperType
      })
    }
  },
  // 选择开数
  checkFoldTimes: function (e) {
    const foldTimes = e.target.dataset.foldtimes
    this.setData({
      'options.foldTimes': foldTimes
    })
  },
  // 选择页数
  checkPages: function (e) {
    const pages = e.detail
    this.setData({
      'options.pages': pages
    })
  },
  // 选择册数
  checkAlbums: function (e) {
    const albums = e.detail
    this.setData({
      'options.albums': albums
    })
  },
  // 选择装订类型
  checkBookBinding: function (e) {
    const bookBinding = e.target.dataset.bookbinding
    this.setData({
      'options.bookBinding': bookBinding
    })
  },
  // 选择寄送类型
  checkDelivery: function (e) {
    const delivery = e.target.dataset.delivery
    this.setData({
      'options.delivery': delivery
    })
  },
  // 显示遮罩层
  showOverlay: function () {
    const data = this.data.options

    const totalPrices = this.getPrices()

    // 直接保存的中文名称
    const storageData = {
      coverPaper: data.coverPaper,
      contentPaper: data.contentPaper,
      foldTimes: data.foldTimes,
      pages: data.pages,
      albums: data.albums,
      bookBinding: data.bookBinding,
      delivery: data.delivery,
      totalPrices
    }

    Dialog.confirm({
      // context: this,
      title: '提示',
      message: '确认提交信息？'
    })
      .then(() => {
        // 将最近一次查询记录的选项存入缓存，供报价单展示选项信息
        wx.setStorageSync('latestQuote', {
          ...storageData
        })
        // 跳转报价结果
        wx.navigateTo({
          url: '../quoteResult/quoteResult'
        })
      })
      .catch(() => {})
  },

  // 把开数中文表达换成英文
  foldTimesFormat: function (foldtimes) {
    foldtimes = foldtimes.slice(0, 2)
    const classType = foldtimes.replace('大度', 'A').replace('正度', 'B')

    return classType
  },

  // 把开数只保留数字部分
  foldTimesNumber: function (foldtimes) {
    foldtimes = foldtimes.match(/\d+/)[0]

    return foldtimes
  },

  // 计算报价结果
  getPrices: function () {
    const data = this.data.options

    // 将中文选项转换成英文形式，用于价格计算
    const transformedData = {
      coverPaper: this.data.coverPaperNameMap[data.coverPaper],
      contentPaper: this.data.contentPaperNameMap[data.contentPaper],
      foldTimes: this.foldTimesNumber(data.foldTimes),
      class: this.foldTimesFormat(data.foldTimes),
      pages: data.pages,
      albums: data.albums,
      bookBinding: data.bookBinding,
      delivery: data.delivery
    }

    // 价格计算结果保存对象
    const prices = {
      cover: util.paperAmount('cover', transformedData.pages, transformedData.foldTimes, transformedData.albums) * util.paperUnitPrice(transformedData.coverPaper, transformedData.class),
      content: util.paperAmount('content', transformedData.pages, transformedData.foldTimes, transformedData.albums) * util.paperUnitPrice(transformedData.contentPaper, transformedData.class),
      layoutDesign: util.layoutDesign(transformedData.pages),
      filmDesign: util.filmDesign(transformedData.pages),
      exposurePS: util.exposurePS(transformedData.pages, transformedData.foldTimes),
      proofing: util.proofing(transformedData.pages),
      printingCover: util.printing('cover'),
      printingContent: util.printing('content'),
      bookbinding: util.bookBinding(transformedData.albums, transformedData.pages, transformedData.foldTimes),
      laminating: util.laminating(transformedData.class),
      plastic: util.plastic(transformedData.albums, transformedData.foldTimes, transformedData.pages),
      packing: util.packing(50, transformedData.albums, 'kraftPaper')
    }

    // 计算基本报价总价
    let totalPrices = 0
    for (const key in prices) {
      if (prices.hasOwnProperty(key)) {
        totalPrices += prices[key]
      }
    }

    return totalPrices.toFixed(2)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
