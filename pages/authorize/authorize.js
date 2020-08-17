// pages/authorize/authorize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url:''
  },
  getUserInfo: function (e) {
    let that = this,userInfo = e.detail.userInfo;
    if (userInfo) {
      // 登录
      wx.login({
        success: res => {
          console.log(res)
          let code = res.code;
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: app.globalData.url + '/login/',
            method: 'POST',
            data: {
              code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              if (res.data.status == 200) {
                console.log(res.data.results.token)
                wx.setStorageSync('token',res.data.results.token)
                wx.setStorageSync('uid',res.data.results.uid)
                app.globalData.userInfo = userInfo
                
                wx.reLaunch({
                  url:that.data.url
                })
              }
            }
          })
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '您点击了拒绝授权，将无法使用小程序的所有功能，请授权之后再使用~',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
        }
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let url = options.url;
    console.log('权限'+url)
    this.setData({
      url:`/pages/index/index?url=${url}`
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