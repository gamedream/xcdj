// pages/myOrders/myOrders.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    isShowDatetime: false,//是否显示日期选择器
    dateTime: util.dateFormat(new Date().getTime(), 'Y年m月d日'),//默认日期为今天

    imgList: [],//图片数组
    page: 1,
    type: '',
    noMore: false,
    timeParam: util.dateFormat(new Date().getTime(), 'Y-m-d')
  },
  //发送给朋友签名
  onShareAppMessage(e) {
    let imgUrl = e.target.dataset.imgurl,imgId = e.target.dataset.imgid,url;
    if(this.data.type == 0){
      url = encodeURIComponent('/pages/joinStorageSign/joinStorageSign?uploadedImgUrl=' + imgUrl + '&imgId=' + imgId);
    }
    if(this.data.type == 1){
      url = encodeURIComponent('/pages/sendSign/sendSign?uploadedImgUrl=' + imgUrl + '&imgId=' + imgId);
    }
    if(this.data.type == 2){
      url = encodeURIComponent('/pages/enterStorageSign/enterStorageSign?uploadedImgUrl=' + imgUrl + '&imgId=' + imgId);
    }
    if(this.data.type == 3){
      url = encodeURIComponent('/pages/sellSign/sellSign?uploadedImgUrl=' + imgUrl + '&imgId=' + imgId);
    }
    return {
      title: '签名',
      path: `/pages/index/index?url=${url}`,
      imageUrl: app.globalData.url + imgUrl
    }
  },
  //查看大图
  showBigImg(e) {
    console.log(e)
    let imgUrl = e.target.dataset.img;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
  },
  //删除
  deletePic(e) {
    let that = this, id = e.target.dataset.id, index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该订单？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/show_info/' + id + '/',
            method: 'DELETE',
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': wx.getStorageSync("token"),
            },
            success(res) {
              if (res.data.status == 200) {
                let list = that.data.imgList;
                list.splice(index, 1)
                that.setData({
                  imgList: list
                })
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success'
                })
              }
              if (res.data.status == 403) {
                //token过期
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../index/index'
                  })
                }, 2200);
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //根据时间查询
  selectByTime() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/show_info/',
      method: 'GET',
      data: {
        type: that.data.type,
        page: 1,
        time: that.data.timeParam
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync("token"),
      },
      success(res) {
        console.log(res.data.results)
        if (res.data.status == 200) {
          let list = res.data.results;
          list.map(item => {
            item.img_urlLocal = item.img_url,
            item.img_url = app.globalData.url + item.img_url
            return item
          })
          console.log(list)
          that.setData({
            imgList: list,
            noMore:false,
            page:1
          })
        }
        if (res.data.status == 403) {
          //token过期
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../index/index'
            })
          }, 2200);
        }
      }
    })
  },
  // 时间-确定按钮
  confirmFn(e) {
    console.log(e.detail)
    var timeNumber = util.dateFormat(e.detail, 'Y年m月d日'), timeParam = util.dateFormat(e.detail, 'Y-m-d');
    this.setData({ dateTime: timeNumber, isShowDatetime: false, timeParam })
  },
  // 时间-取消按钮
  cancelFn() {
    this.setData({ isShowDatetime: false, currentDate: new Date().getTime() });
  },
  // 点击唤出时间选择弹窗
  changeDateTime(e) {
    this.setData({
      isShowDatetime: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type * 1
    })
    if(that.data.type == 0){
      wx.setNavigationBarTitle({
        title: '我的入库单'
      })
    }
    if(that.data.type == 1){
      wx.setNavigationBarTitle({
        title: '我的送货单'
      })
    }
    if(that.data.type == 2){
      wx.setNavigationBarTitle({
        title: '我的进货单'
      })
    }
    if(that.data.type == 3){
      wx.setNavigationBarTitle({
        title: '我的销售单'
      })
    }
    wx.request({
      url: app.globalData.url + '/show_info/',
      method: 'GET',
      data: {
        type: that.data.type,
        page: that.data.page,
        time: that.data.timeParam
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync("token"),
      },
      success(res) {
        if (res.data.status == 200) {
          let list = res.data.results;
          list.map(item => {
            item.img_urlLocal = item.img_url,
            item.img_url = app.globalData.url + item.img_url
            return item
          })
          that.setData({
            imgList: list
          })
        }
        if (res.data.status == 403) {
          //token过期
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../index/index'
            })
          }, 2200);
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page
    page++;
    that.setData({
      page: page,
      type: that.data.type
    })
    if (!that.data.noMore) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      wx.request({
        url: app.globalData.url + '/show_info/',   //请求的接口地址
        data: {
          page: that.data.page,    //  页数
          type: that.data.type,
          time: that.data.timeParam
        },
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync("token"),
        },
        method: 'GET',
        success: function (res) {
          console.log(res)
          if (res.data.status == 200) {
            let newList = res.data.results;
            if (newList.length > 0) {
              newList.map(item => {
                item.img_urlLocal = item.img_url,
                item.img_url = app.globalData.url + item.img_url
                return item
              })
            }
            let list = that.data.imgList.concat(newList)     //imgList  为一进入页面请求完数据定义的集合
            that.setData({
              imgList: list,
            });
            // if (res.data.results.length == 0) {
            //   that.setData({ noMore: true })
            // } else {
            //   that.setData({
            //     imgList: list,
            //   });
            // }
            wx.hideLoading();
          }
          if (res.data.status == 404) {
            // let list = that.data.imgList.concat(newList) 
            that.setData({ noMore: true,page:1})
            wx.hideLoading();
          } 
          
          if (res.data.status == 403) {
            //token过期
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../index/index'
              })
            }, 2200);
          }
        },
      })
    }
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




})