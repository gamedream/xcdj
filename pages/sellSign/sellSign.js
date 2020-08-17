// pages/joinStorageSign/joinStorageSign.js
var onShowFlag;//控制预览图片后再次加载onshow方法的全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signSrc: '',//签名图路径
    role: '',//角色
    info:{},//从签名页回传本页的数据
    orderSrcNet: '',//订单图网上路径
    orderSrcLocal: '',//订单图本地路径
    img_id:''
  },

  // 方法合集
  //预览大图
  showBigImg() {
    onShowFlag = true;
    wx.previewImage({
      current: this.data.orderSrcLocal, // 当前显示图片的http链接
      urls: [this.data.orderSrcLocal] // 需要预览的图片http链接列表
    })
  },
  //签名
  signFn(e) {
    let role = e.target.dataset.role,type = 'sellTP';
    wx.navigateTo({
      url: '/pages/signPage/signPage?role=' + role + '&type=' + type
    })
  },
  //提交
  update() {
    var that = this;//坑1： this需要这么处理
    let uid = wx.getStorageSync('uid');
    console.log('图片id：'+that.data.img_id)
    wx.uploadFile({
      url: app.globalData.url + '/sign_img/' + that.data.img_id + '/', //app.ai_api.File.file
      filePath: that.data.orderSrcLocal,  //文件路径 
      name: 'img',  //随意
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': wx.getStorageSync("token"),  //如果需要token的话要传
      },
      formData: {
        // method: 'PUT',//请求方式
        // img_id:that.data.img_id,
        // uid
      },
      success(res) {
        var data = JSON.parse(res.data)  // 坑2：与wx.request不同的是，upload返回的是字符串格式，需要字符串对象化
        console.log('请求返回的数据' + data)
        if (data.status == 200) {
          wx.showToast({
            title: data.msg,
            icon: 'success'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index',
            })
          }, 1500);
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      },
      complete(res) {
        
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ orderSrcNet:app.globalData.url + options.uploadedImgUrl,
      img_id:options.imgId})
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
    if (onShowFlag) {
      onShowFlag = false;
      return;
    }
    let that = this,pages = getCurrentPages(),currentPage = pages[0];
    wx.showLoading({
      title: '加载图片中...',
      icon: 'loading',
      duration: 1000
    })
    wx.getImageInfo({
      src: that.data.orderSrcNet,
      success: function (res) {
        that.setData({orderSrcLocal:res.path})
        wx.hideLoading()
      },
      fail: function (res) {
        console.log('fail')
      }
    })
    if (currentPage.data.info.signSrc) {
      //获取模板图片信息
      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.orderSrcNet,
          success: function (res) {
            resolve(res);
          },
          fail: function (res) {
            reject('reject1')
          }
        })
      });
      //获取签名图片信息
      let promise2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: currentPage.data.info.signSrc,
          success: function (res) {
            resolve(res);
          }, fail: function (res) {
            reject('reject2')
          }
        })
      });
      Promise.all([
        promise1, promise2
      ]).then(res => {
        wx.showLoading({
          title: '图片生成中...',
          icon: 'loading',
          duration: 1000
        })
        /* 图片获取成功才执行后续代码 */
        var canvas = wx.createCanvasContext('templateCanvas')
        // 绘制背景图

        canvas.drawImage(res[0].path, 0, 0, 960, 872);

        //绘制签名
        if (currentPage.data.info.role == 'receive') {
          canvas.drawImage(res[1].path, 180, 815);
        }
        if (currentPage.data.info.role == 'send') {
          canvas.drawImage(res[1].path, 710, 815);
        }
        canvas.draw(false, setTimeout(function () {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 960,
            height: 872,
            destWidth: 960,
            destHeight: 872,
            canvasId: 'templateCanvas',
            success: function (res) {
              that.setData({
                orderSrcLocal: res.tempFilePath,
              })
              wx.hideLoading()
            },
            fail: function (res) { }
          })
        }, 1000));
        console.log('画完了')
      }).catch(rej => {
        console.log('失败：' + rej)
      })
    }
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