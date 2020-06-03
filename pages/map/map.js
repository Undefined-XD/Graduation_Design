// pages/map/map.js
const amapFile = require('./amap-wx.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 地点提示列表
    tips: {},
    // 地点提示列表展示状态：block / none
    displayStatus: 'none',
    // 驾车距离
    distance: '',
    // 连线点
    polyline: [],
    // 导航路线起始坐标
    origin: '120.343226,30.314284',
    // 导航路线目的地坐标
    destination: '',
    // 目的地名称
    destinationName: '',
    // 标记点
    markers: [{
      id: 0,
      latitude: 30.314284,
      longitude: 120.343226,
      width: 23,
      height: 33
    }, {
      id: 0,
      latitude: 30.314284,
      longitude: 120.343226,
      width: 24,
      height: 34
    }]
  },

  // 地点输入事件
  bindInput: function (e) {
    var that = this
    var keywords = e.detail.value
    var myAmapFun = new amapFile.AMapWX({ key: '6cf8e9a26eeef0e051cc2f1bec83ea4b' })
    // 地点提示列表显示
    this.setData({
      displayStatus: 'block'
    })

    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          })
        }
      }
    })
  },

  // 点击某地点提示条目
  bindSearch: function (e) {
    const that = this
    const keywords = e.target.dataset.keywords
    // 遍历提示列表的索引
    let i = 0
    while (i < this.data.tips.length) {
      // 目的地全名
      const targetName = this.data.tips[i].district + this.data.tips[i].name

      if (keywords === targetName) {
        // 获取目的地坐标
        const targetLocation = this.data.tips[i].location
        if (!targetLocation.length) {
          this.setData({
            displayStatus: 'none'
          })
          return
        }
        // 获取目的地经度
        const targetLongitude = targetLocation.split(',')[0]
        // 获取目的地纬度
        const targetLatitude = targetLocation.split(',')[1]

        this.setData({
          // 设置目标地点
          destination: targetLocation,
          // 保存目的地名称
          destinationName: keywords,
          // 关闭地点提示列表
          displayStatus: 'none',
          // 设置目的地标记
          'markers[1].longitude': targetLongitude,
          'markers[1].latitude': targetLatitude
        })

        // 路线导航
        this.routeLine()
        // 进行缩放
        this.scaleMap()
        return
      }

      i++
    }
  },

  // 缩放地图
  scaleMap: function () {
    const that = this
    // 缩放地图视野以包含全部标记点
    const mapCtx = wx.createMapContext('navi_map')
    mapCtx.includePoints({
      padding: [70, 70, 70, 70],
      points: [{
        latitude: that.data.markers[0].latitude,
        longitude: that.data.markers[0].longitude
      }, {
        latitude: that.data.markers[1].latitude,
        longitude: that.data.markers[1].longitude
      }]
    })
  },

  // 任意点击地图事件
  bindTap: function (e) {
    // 判断当前地点提示列表是否显示，若显示则只关闭地点提示列表，不做导航处理
    if (this.data.displayStatus === 'block') {
      this.setData({
        displayStatus: 'none'
      })
    } else {
      // 根据新地点进行路线导航
      this.setData({
        destination: e.detail.longitude + ',' + e.detail.latitude,
        'markers[1].longitude': e.detail.longitude,
        'markers[1].latitude': e.detail.latitude
      })
      // 绘制路线
      this.routeLine()
      // 解析标记点地址
      this.addressResolve(e)
    }
  },

  // 地址逆解析
  addressResolve: function (e) {
    const that = this
    wx.serviceMarket.invokeService({
      service: 'wxc1c68623b7bdea7b',
      api: 'rgeoc',
      data: {
        location: e.detail.latitude + ',' + e.detail.longitude,
        get_poi: 1,
        poi_options: 'policy=1'
      }
    }).then(res => {
      console.log(res)
      // 获取综合地址
      const addressComponent = res.data.result.address_component
      // 提取省份
      const province = addressComponent.province
      // 提取城市
      const city = addressComponent.city
      // 提取具体区域
      const address = res.data.result.formatted_addresses.recommend
      // 最终地点
      const destination = province + (province !== city ? city : '') + address

      console.log(destination)
      // 保存点击后的最终地点名
      that.setData({
        destinationName: destination
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 绘制导航路线
  routeLine: function () {
    const that = this
    const myAmapFun = new amapFile.AMapWX({ key: '6cf8e9a26eeef0e051cc2f1bec83ea4b' })
    myAmapFun.getDrivingRoute({
      origin: that.data.origin,
      destination: that.data.destination,
      success: function (data) {
        var points = []
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';')
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [
            {
              points: points,
              color: '#0091ff',
              width: 6
            }
          ]
        })
        if (data.paths[0] && data.paths[0].distance) {
          let mapDistance = data.paths[0].distance
          // 转换单位
          if (mapDistance >= 1000) {
            mapDistance /= 1000
            mapDistance += '公里'
          } else {
            mapDistance += '米'
          }

          that.setData({
            distance: mapDistance
          })
        }
      },
      fail: function (info) {
        console.log(info)
      }
    })
  },

  // 返回地址信息
  returnAddress: function () {
    const that = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.emit('acceptDataFromOpenedPage', {
      destination: that.data.destination,
      address: that.data.destinationName,
      distance: that.data.distance,
      markers: that.data.markers
    })

    // 返回上级页面
    wx.navigateBack({
      delta: 1
    })
  },

  // 清除地址信息
  clearAddress: function () {
    const destination = this.data.origin
    this.setData({
      destination: destination,
      markers: [{
        id: 0,
        latitude: 30.314284,
        longitude: 120.343226,
        width: 23,
        height: 33
      }, {
        id: 0,
        latitude: 30.314284,
        longitude: 120.343226,
        width: 24,
        height: 34
      }]
    })
    this.routeLine()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data.markers)
      if (data.destination) {
        console.log(data.destination)
        that.setData({
          destination: data.destination,
          markers: data.markers
        })

        // 绘制路线
        that.routeLine()
        // 进行缩放
        that.scaleMap()
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
