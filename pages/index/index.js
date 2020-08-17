//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    signUrl: ''
  },
  //事件处理函数
  onShow: function () {
    var that = this;
    
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })

    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // }else if(app.globalData.userInfo == null){
    //   console.log(12)
    //   //未授权跳转到授权页
    //   wx.navigateTo({
    //     url: '../authorize/authorize'
    //   })
    // }
    //  else {
    //   console.log(123)
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onLoad: function (options) {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
              })
              //如果带有url就是用户通过被分享
              if (options.url) {
                console.log('主页1'+options.url)
                let url = decodeURIComponent(options.url);
                console.log('主页'+url)
                that.setData({ signUrl: url })
              }
              if (that.data.signUrl) {
                wx.navigateTo({
                  url: that.data.signUrl
                })
              }
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          //未授权跳转到授权页
          let url = options.url;
          // console.log('index'+url)
          // let url = '123?123';
          app.globalData.gotoUrl = url
          wx.switchTab({
            url: `/pages/mine/mine`
          })
        }
      }
    })
  },
  toFillData: function (e) {
    if(!app.globalData.userInfo){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }
      });
      return
    }
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case "joinStorageTP":
        wx.navigateTo({
          url: '/pages/joinStorageTP/joinStorageTP'
        })
        break;
      case "sendTP":
        wx.navigateTo({
          url: '/pages/sendTP/sendTP'
        })
        break;
      case "enterStorageTP":
        wx.navigateTo({
          url: '/pages/enterStorageTP/enterStorageTP'
        })
        break;
      case "sellTP":
        wx.navigateTo({
          url: '/pages/sellTP/sellTP'
        })
        break;
    }
  }
})
