// pages/functions/setParams/setParams.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 纸张类型，供渲染使用
    paperArr: [
      { paper: '铜版纸' },
      { paper: '牛皮纸' },
      { paper: '瓦楞纸' }
    ],
    // 其他设置，供渲染使用
    settingArr: [
      { settingName: '设计费', cost: 100 },
      { settingName: '胶片费', cost: 100 },
      { settingName: '晒PS版', cost: 100 },
      { settingName: '打样费', cost: 100 },
      { settingName: '色令费', cost: 100 },
      { settingName: '开机费', cost: 100 },
      { settingName: '装订费', cost: 100 }
    ]
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
