// pages/functions/paramsDetail/paramsDetail.js
import Dialog from '@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 纸张价格
    paperPrice: 0,
    // 纸张损耗率
    scrapRate: 0,
    // 纸张面积
    paperArea: 1
  },

  // 跳转纸张参数总页
  jumpToSetParams: function () {
    wx.navigateTo({
      url: '../setParams/setParams'
    })
  },

  // 纸张参数修改提交
  paramsSubmit: function () {
    Dialog.confirm({
      message: '是否确认提交参数修改？'
    }).then(() => {
      // on close
      console.log('提交')
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
