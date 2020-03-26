// pages/functions/setParams/setParams.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 显示参数修改弹窗
    showEditDialog: false,
    // 纸张类型，供渲染使用
    paperArr: [
      // { paper: '铜版纸' },
      // { paper: '牛皮纸' },
      // { paper: '瓦楞纸' }
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
    ],
    // 被修改的项目
    editedItem: '',
    // 修改后的值
    editedValue: '',
    isInputFormatWrong: false
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

  // 跳转纸张类型参数详情设置页面
  jumpToParamsDetail: function () {
    wx.navigateTo({
      url: '../paramsDetail/paramsDetail'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 访问数据库获取纸张类型数据
    const that = this
    wx.request({
      url: 'http://localhost:8080?target=paper',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          paperArr: res.data
        })
      }
    })

    // 访问数据库获取其他参数数据
    wx.request({
      url: 'http://localhost:8080/?target=other',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          settingArr: res.data[0]
        })
      }
    })
  },

  // 显示参数修改弹窗
  editParams: function (e) {
    this.setData({ showEditDialog: true })
  },

  // 标记修改的值
  onOpen: function (e) {
    this.setData({ editedItem: e.target.dataset.param })
    // console.log(e.target.dataset)
  },

  // 校验输入值，用于标记提示文本
  checkInput: function (e) {
    const inputValue = e.detail.value
    const reg = /\D/g

    this.setData({
      isInputFormatWrong: reg.test(inputValue),
      editedValue: inputValue
    })
  },

  // 弹窗关闭毁掉
  inputClose: function (e) {
    const closeType = e.detail

    if (closeType === 'confirm') {
      if (!this.data.isInputFormatWrong) {
        console.log(this.data.editedItem, this.data.editedValue)
      }
    }

    // 修改值和错误文本提示进行重置
    this.setData({
      editedValue: '',
      isInputFormatWrong: false
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
