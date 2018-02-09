// index.js
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {
      id: 0,
      nickName: '王菲',
      avatarUrl: '../../../resources/banner/1.jpg'
    },
    orderTotal: {
      "created": 0,
      "paid": 10,
      "delivering": 9,
      "deliveried": 8,
      "finished": 7,
      "cancelled": 6
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setUserInfo();
    // this.getOrderTotal();
  },

  logout (){
    wx.removeStorageSync('token');
    wx.removeStorageSync('user');
    util.showToast('退出登录成功', 'success');
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 1500)
  },

  /**
   * 设置会员信息
   */
  setUserInfo() {
    let user = wx.getStorageSync('userInfo');
    this.setData({
      user: user
    })
  },

  /**
   * 获取订单数量
   */
  getOrderTotal() {
    util.request(util.apiUrl + 'ecapi.order.subtotal', 'POST').then((res) => {
      this.setData({
        orderTotal: res.subtotal,
      });
    });
  },

  /**
   * 绑定用户名和头像的事件
   */
  bindUserTap() {

    if (wx.getStorageSync('token')) {
      //个人信息页面
    } else {
      //跳转到登录页面
      wx.navigateTo({
        url: '/pages/auth/login/login',
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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