// pages/joinStorageTP/joinStorageTP.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NO: '',
    address: '', //地址
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
    phone: '',//电话
    customer: '',//客户

    //内容数组
    rowsList: [
      {
        rowNumber: 1,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 2,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 3,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 4,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 5,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 6,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 7,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 8,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 9,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
      {
        rowNumber: 10,//行的序号
        nameAndSize: '',//品名及规格
        goodCount: '',//数量
        goodMoney: '',//单价
        goodTotal: '',//金额
      },
    ],


    activeNames: ['1'],//展开的面板

    isShowImg: false,//是否展示图片
    imgSrc: '',//canvas生成的临时图片路径

    // pageFnType: 0,//0:填写单 1签名
    uploadAlready: false,//是否已经上传
    uploadTime: true,
    img_id:'',
    uploadedImgUrl:''
  },
  // ----------------------------------------方法
  //上传
  uploadToCenter() {
    var that = this;//坑1： this需要这么处理
    let uid = wx.getStorageSync('uid'), type = 1;
    wx.uploadFile({
      url: app.globalData.url + '/upload/', //app.ai_api.File.file
      filePath: that.data.imgSrc,  //文件路径 
      name: 'img',  //随意
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': wx.getStorageSync("token"),  //如果需要token的话要传
      },
      formData: {
        method: 'POST',//请求方式
        img_id:that.data.img_id,
        uid,
        type
      },
      success(res) {
        var data = JSON.parse(res.data)  // 坑2：与wx.request不同的是，upload返回的是字符串格式，需要字符串对象化
        if (data.status == 200) {
          console.log(data)
          wx.showToast({
            title: data.msg,
            icon: 'success'
          })
          that.setData({
            uploadAlready: true,
            uploadTime: false,
            img_id:data.results.img_id,
            uploadedImgUrl:data.results.img_url
          })
          setTimeout(() => {
            that.setData({
              uploadTime: true
            })
          }, 5000);
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
  //发送给朋友签名
  onShareAppMessage() {
    // let url = encodeURIComponent('/pages/joinStorageTP/joinStorageTP?type=' + 1);
    let url = encodeURIComponent('/pages/sendSign/sendSign?uploadedImgUrl=' + this.data.uploadedImgUrl + '&imgId=' + this.data.img_id);
    return {
      title: '签名',
      path: `/pages/index/index?url=${url}`,
      imageUrl:this.data.imgSrc
    }
  },
  //预览大图
  showBigImg() {
    wx.previewImage({
      current: this.data.imgSrc, // 当前显示图片的http链接
      urls: [this.data.imgSrc] // 需要预览的图片http链接列表
    })
  },
  //生成订单
  createOrder() {
    let headData = {
      NO: this.data.NO,
      address: this.data.address,
      dateTime: this.data.dateTime,
      phone: this.data.phone,
      customer: this.data.customer
    },
      rowsData = this.data.rowsList,
      allMoneyTotal = '',
      allMoneyTotalStr = '';

    rowsData.map(item => {
      allMoneyTotal = allMoneyTotal*1 + item['goodTotal']*1
    })

    //总金额转成大写
    allMoneyTotalStr = this.moneyToString(allMoneyTotal);

    let allData = {
      headData, rowsData, allMoneyTotal, allMoneyTotalStr
    };



    // 获取背景图片信息
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../resources/templatesImgs/send.png',
        success: function (res) {
          resolve(res);
        }
      })
    });

    Promise.all([
      promise1
    ]).then(res => {

      wx.showLoading({
        title: '订单模板生成中...',
        icon: 'loading',
        duration: 1000
      })
      /* 图片获取成功才执行后续代码 */
      var canvas = wx.createCanvasContext('templateCanvas') //获取画布
      canvas.drawImage('../../' + res[0].path, 0, 0, 967, 677); //填充背景

      //绘制NO.文本
      canvas.setFontSize(17)
      canvas.setFillStyle('red')
      canvas.fillText(headData.NO, 670, 32)

      //绘制地址
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(headData.address, 70, 72)

      //绘制电话
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(headData.phone, 630, 72)

      //绘制客户
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(headData.customer, 70, 100)

      //绘制时间
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(headData.dateTime, 575, 100)

      //绘制内容
      let rowY = 178;
      for (let index = 0; index < rowsData.length; index++) {
        //绘制货号
        canvas.setFontSize(17)
        canvas.setFillStyle('black')
        canvas.fillText(rowsData[index].nameAndSize, 50, rowY)
        
        //绘制数量
        canvas.setFontSize(17)
        canvas.setFillStyle('black')
        canvas.fillText(rowsData[index].goodCount, 575, rowY)

        //绘制单价
        canvas.setFontSize(17)
        canvas.setFillStyle('black')
        canvas.fillText(rowsData[index].goodMoney, 680, rowY)

        //绘制金额
        canvas.setFontSize(17)
        canvas.setFillStyle('black')
        canvas.fillText(rowsData[index].goodTotal, 780, rowY)
        
        rowY += 42;
      }

      //绘制合计大写
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(allMoneyTotalStr, 125, 602)

      //绘制全部总额(合计大写右边￥)
      canvas.setFontSize(17)
      canvas.setFillStyle('black')
      canvas.fillText(allMoneyTotal, 650, 602)

      //画
      canvas.draw()

      //保存成图片
      var that = this;
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 967,
          height: 677,
          destWidth: 967,
          destHeight: 677,
          canvasId: 'templateCanvas',
          success: function (res) {
            that.setData({
              imgSrc: res.tempFilePath,
              isShowImg: true
            })
            that.goTop();
            wx.hideLoading()
          },
          fail: function (res) { }
        })
      }, 500)

    })
  },
  // --------------------------------------画图

  //总金额转成大写方法
  moneyToString(n) {
    var fraction = ['角', '分'];
    var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  },
  //回到顶部 wx.pageScrollTo
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用回到顶部功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //切换面板
  onChangeCollapse(e) {
    this.setData({
      activeNames: e.detail,
    });
  },
  //计算金额
  countFn(e) {
    let index = e.target.dataset.index,
      goodCount = this.data.rowsList[index].goodCount,
      goodMoney = this.data.rowsList[index].goodMoney,
      goodTotal = (goodCount * (goodMoney * 1000)) / 1000,
      temp = 'rowsList[' + index + '].goodTotal';
    this.setData({
      [temp]: goodTotal
    })
  },
  //输入单价
  changeGoodMoney(e) {
    let index = e.target.dataset.index,
      temp = 'rowsList[' + index + '].goodMoney',
      temp2 = 'rowsList[' + index + '].goodTotal'
    this.setData({ [temp]: e.detail, [temp2]: '' })
  },
  //输入数量
  changeGoodCount(e) {
    let index = e.target.dataset.index,
      temp = 'rowsList[' + index + '].goodCount',
      temp2 = 'rowsList[' + index + '].goodTotal'
    this.setData({ [temp]: e.detail, [temp2]: '' })
  },
  // 输入品名及规格
  changeNameAndSize(e) {
    let index = e.target.dataset.index,
      temp = 'rowsList[' + index + '].nameAndSize'
    this.setData({ [temp]: e.detail })
  },
  
  // 时间-确定按钮
  confirmFn(e) {
    var timeNumber = util.dateFormat(e.detail, 'Y年m月d日');
    this.setData({ dateTime: timeNumber, isShowDatetime: false })
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
  //填写客户
  changeCustomer(e) {
    this.setData({ customer: e.detail })
  },
  //填写电话
  changePhone(e) {
    this.setData({ phone: e.detail })
  },
   //填写地址
   changeAddress(e) {
    this.setData({ address: e.detail })
  },
  //填写NO
  changeNO(e) {
    this.setData({ NO: e.detail })
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
    // let that = this;
    // //显示客服入口
    // // 获取系统参数
    // wx.getSystemInfo({
    //   success: res => {
    //     console.log(res)
    //     that.globalData.screenWidth = res.screenWidth;
    //     that.globalData.screenHeight = res.screenHeight;
    //   }
    // })
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

})