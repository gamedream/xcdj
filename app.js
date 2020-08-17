//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     let code = res.code;
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     wx.request({
    //       url: this.globalData.url + '/login/', 
    //       method:'POST',
    //       data: {
    //         code
    //       },
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success (res) {
    //         console.log(res)
    //       }
    //     })
    //   }
    // })
    
  },
  globalData: {
    userInfo: null,
    // url:'http://192.168.0.101:8080'  //本地全局域名
    url:'https://test.zymyun.com',  //测试
    gotoUrl:''
  }
})