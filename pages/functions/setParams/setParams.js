// pages/functions/setParams/setParams.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 纸张类型，供渲染使用
    paperArr: [
      { paper: '铜版纸', price: 1000 },
      { paper: '牛皮纸', price: 2000 },
      { paper: '瓦楞纸', price: 3000 }
    ],
    // 开数类型，供渲染使用
    foldTimesArr: [4, 8, 16, 32],
    // 装订类型，供渲染使用
    bookBindingArr: ['无线胶装', '锁线胶装'],
    // 寄送方式，供渲染使用
    deliveryArr: ['自提', '寄送']
  },

  http: function (e) {
    console.log('http 请求')
    wx.request({
      url: 'http://localhost:8080/',
      method: 'get',
      dataType: '',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('http res:', res)
        console.log(res.data[0])
      }
    })
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
