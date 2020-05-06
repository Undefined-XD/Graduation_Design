// pages/quoteDetailOptions/quoteDetailOptions.js
import Dialog from '@vant/weapp/dialog/dialog'

const util = require('../../functions/utils2')
const app = getApp()
const serverIP = app.globalData.serverIP

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
    // 烫印类型，供渲染使用
    stampingArr: ['烫金', '烫银'],
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
      // 已选烫印类型
      stamping: '烫金',
      // 已选寄送类型
      delivery: '自提'
    },
    // 封面用纸中英文对照
    coverPaperNameMap: {
      铜版纸: 'ArtPaper',
      哑粉纸: 'MattArtPaper',
      双胶纸: 'OffsetPaper'
    },
    // 内页用纸中英文对照
    contentPaperNameMap: {
      铜版纸: 'ArtPaper',
      哑粉纸: 'MattArtPaper',
      双胶纸: 'OffsetPaper'
    },
    // 其他选项中英文对照
    otherOptionsNameMap: {
      烫金: 'gold',
      烫银: 'silver'
    },
    // 纸张类别选择器
    paperClassPicker: '请选择',
    // 纸张克重：铜版纸
    paperWeightA: [105, 128, 157, 200],
    // 纸张克重：哑粉纸
    paperWeightB: [105, 128, 157, 200],
    // 纸张克重：双胶纸
    paperWeightC: [60, 70, 80, 100],
    // 封面克重选项
    coverWeight: [],
    // 内页克重选项
    contentWeight: [],
    // 封面克重选择器
    coverWeightPicker: '157',
    // 内页克重选择器
    contentWeightPicker: '128',
    // 自定义设计制作费
    customDesignUnitPrice: {
      // 版面设计
      layout: 0,
      // 出胶片
      film: 0,
      // 晒PS版
      exposure: 0,
      // 打样费用
      proofing: 0
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
      switch (paperType) {
        case '铜版纸':
          this.setData({ coverWeight: this.data.paperWeightA })
          break
        case '哑粉纸':
          this.setData({ coverWeight: this.data.paperWeightB })
          break
        case '双胶纸':
          this.setData({ coverWeight: this.data.paperWeightC })
      }

      // 选择对应纸张类型后，绑定将当前纸张克重第一项
      this.setData({ coverWeightPicker: this.data.coverWeight[0] })
    } else {
      this.setData({
        'options.contentPaper': paperType
      })
      switch (paperType) {
        case '铜版纸':
          this.setData({ contentWeight: this.data.paperWeightA })
          break
        case '哑粉纸':
          this.setData({ contentWeight: this.data.paperWeightB })
          break
        case '双胶纸':
          this.setData({ contentWeight: this.data.paperWeightC })
      }

      // 选择对应纸张类型后，绑定将当前纸张克重第一项
      this.setData({ contentWeightPicker: this.data.contentWeight[0] })
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

  // 获取自定义的设计与打样参数
  setCustomDesignUnitPrice: function (e) {
    // 从相应的 input 上的 dataset 上获取自定义参数名
    const customType = 'customDesignUnitPrice.' + e.target.dataset.type
    const customValue = parseFloat(e.detail.value)

    this.setData({
      [customType]: customValue
    })

    console.log(customType, customValue)
    console.log(this.data.customDesignUnitPrice)
  },

  // 选择装订类型
  checkBookBinding: function (e) {
    const bookBinding = e.target.dataset.bookbinding
    this.setData({
      'options.bookBinding': bookBinding
    })
  },
  // 选择烫印类型
  checkStamping: function (e) {
    const stamping = e.target.dataset.stamping

    this.setData({
      'options.stamping': stamping
    })
    console.log(this.data.options.stamping)
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
    const that = this.data

    // 获取最终报价，并存入本地缓存
    this.getPrices()

    // 直接保存的中文名称
    const storageData = {
      coverPaper: data.coverPaper,
      contentPaper: data.contentPaper,
      foldTimes: data.foldTimes,
      pages: data.pages,
      albums: data.albums,
      bookBinding: data.bookBinding,
      delivery: data.delivery,
      coverWeight: that.coverWeightPicker,
      contentWeight: that.contentWeightPicker
    }

    Dialog.confirm({
      // context: this,
      title: '提示',
      message: '确认提交信息？'
    })
      .then(() => {
        // 清空本地缓存
        wx.clearStorageSync()
        // 将最近一次查询记录的选项存入缓存，供报价单展示选项信息
        wx.setStorageSync('latestQuote', {
          ...storageData,
          totalPrices: that.totalMoney
        })
        // 跳转报价结果
        wx.navigateTo({
          url: '../quoteResult/quoteResult?recommendType=accurate',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage',
              {
                recommendType: 'accurate',
                ...that.customDesignUnitPrice
              })
          }
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
    const thatData = this.data
    const that = this

    // 将中文选项转换成英文形式，用于价格计算
    const transformedData = {
      coverPaper: this.data.coverPaperNameMap[data.coverPaper],
      contentPaper: this.data.contentPaperNameMap[data.contentPaper],
      foldTimes: this.foldTimesNumber(data.foldTimes),
      class: this.foldTimesFormat(data.foldTimes),
      coverWeight: this.data.coverWeightPicker + 'g',
      contentWeight: this.data.contentWeightPicker + 'g',
      pages: data.pages,
      albums: data.albums,
      bookBinding: data.bookBinding,
      delivery: data.delivery
    }

    // 价格计算结果保存对象
    // const prices = {
    //   cover:
    //     util.paperAmount('cover', transformedData.pages, transformedData.foldTimes, transformedData.albums) *
    //     util.paperUnitPrice(transformedData.coverPaper + transformedData.coverWeight, transformedData.class),
    //   content:
    //     util.paperAmount('content', transformedData.pages, transformedData.foldTimes, transformedData.albums) *
    //     util.paperUnitPrice(transformedData.contentPaper + transformedData.contentWeight, transformedData.class),
    //   layoutDesign: util.layoutDesign(transformedData.pages),
    //   filmDesign: util.filmDesign(transformedData.pages),
    //   exposurePS: util.exposurePS(transformedData.pages, transformedData.foldTimes),
    //   proofing: util.proofing(transformedData.pages),
    //   printingCover: util.printing('cover'),
    //   printingContent: util.printing('content'),
    //   bookbinding: util.bookBinding(transformedData.albums, transformedData.pages, transformedData.foldTimes),
    //   laminating: util.laminating(transformedData.class),
    //   plastic: util.plastic(transformedData.albums, transformedData.foldTimes, transformedData.pages),
    //   packing: util.packing(50, transformedData.albums, 'kraftPaper')
    // }

    const items = {
      cover: transformedData.coverPaper + transformedData.coverWeight,
      content: transformedData.contentPaper + transformedData.contentWeight,
      albums: transformedData.albums,
      foldTimes: data.foldTimes,
      pages: transformedData.pages,
      bookbinding: data.bookBinding,
      delivery: data.delivery,
      ps: thatData.customDesignUnitPrice.exposure,
      film: thatData.customDesignUnitPrice.film,
      layout: thatData.customDesignUnitPrice.layout,
      proofing: thatData.customDesignUnitPrice.proofing
    }
    console.log('items', items)

    wx.request({
      // url: 'http://localhost:8080?manipulation=calculate&quoteType=accurate',
      url: `${serverIP}?manipulation=calculate&quoteType=accurate`,
      data: {
        allOptions: items
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          totalMoney: res.data
        })
      }
    })

    // 计算基本报价总价
    // let totalPrices = 0
    // for (const key in prices) {
    //   if (prices.hasOwnProperty(key)) {
    //     totalPrices += prices[key]
    //   }
    // }

    // return totalPrices.toFixed(2)
  },

  // 纸张类别选择器
  paperClassPicker: function (e) {
    this.setData({
      paperClassPicker: this.data.paperClass[e.detail.value]
    })
  },

  // 封面克重选择器
  coverWeightPicker: function (e) {
    this.setData({
      coverWeightPicker: this.data.coverWeight[e.detail.value]
    })
  },

  // 内页克重选择器
  contentWeightPicker: function (e) {
    this.setData({
      contentWeightPicker: this.data.contentWeight[e.detail.value]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 默认初始化纸张克重选项
    this.setData({
      coverWeight: this.data.paperWeightA,
      contentWeight: this.data.paperWeightA
    })

    const that = this
    // 获取其他单价参数
    wx.request({
      // url: 'http://localhost:8080?table=other_unit_prices&manipulation=retrieve&mark=other_unit_prices_retrieve',
      url: `${serverIP}?table=other_unit_prices&manipulation=retrieve&mark=other_unit_prices_retrieve`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        const resData = res.data[0]
        // 对其他参数进行赋值
        that.setData({
          'customDesignUnitPrice.exposure': resData['PS版'],
          'customDesignUnitPrice.layout': resData['设计费'],
          'customDesignUnitPrice.film': resData['菲林'],
          'customDesignUnitPrice.proofing': resData['打样费']
        })
      }
    })
  },

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
