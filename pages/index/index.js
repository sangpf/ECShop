//index.js
const util = require('../../utils/util.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    banners: [
    {
        src: '../../resources/banner/1.jpg',
    }, {
        src: '../../resources/banner/2.jpg',
    }, {
        src: '../../resources/banner/3.jpg',
    }, {
        src: '../../resources/banner/4.jpg',
    }, {
        src: '../../resources/banner/5.jpg',
    }
    ],
    notices: [],
    goodProducts: [
      {
        photo:'../../resources/goodProducts/4.jpg',
        name:'毛衣',
        current_price:99,
        id:1
      },
      {
        photo: '../../resources/goodProducts/4.jpg',
        name: '毛衣',
        current_price: 99,
        id: 1
      },
      {
        photo: '../../resources/goodProducts/3.jpg',
        name: '毛衣',
        current_price: 99,
        id: 1
      }, {
        photo: '../../resources/goodProducts/4.jpg',
        name: '毛衣',
        current_price: 99,
        id: 1
      }
    ],
    hotProducts: [],
    recentlyProducts: [],
    src: '../../resources/1.jpg'
  },

  onLoad: function () {
    // this.getBanner();
    // this.getNotices();
    this.getPorducts();
  },

// 用户登录
  userLogin(){
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://sking.online/nut/User_login.do',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  //获取用户信息
  getUserInfo(){
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country

        var rawData = res.rawData
        var signature = res.signature
        var encryptedData = res.encryptedData
        var iv = res.iv

        console.log(userInfo)
        console.log(rawData)
        console.log(signature)
        console.log(encryptedData)
        console.log(iv)

        wx.setStorageSync('userInfo', userInfo);

      }
    })
  },

// 加载轮播图列表
  getBanner() {
      wx.request({
        url: 'http://sking.online:8080/sking/index/getBanner.do',
        data: {
          id: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data.allBanner)
          banners: res.data.allBanner
        }

      })

    // util.request(util.apiUrl + 'ecapi.banner.list', 'POST').then((res) => {
    //   this.setData({
    //     banners: res.banners
    //   })
    // });
  },

  getNotices() {
    util.request(util.apiUrl + 'ecapi.notice.list', 'POST', {
      page: 1,
      per_page: 5
    }).then((res) => {
      this.setData({
        notices: res.notices
      });
    });
  },

  getPorducts_bak() {
    util.request(util.apiUrl + 'ecapi.home.product.list', 'POST').then((res) => {
      this.setData({
        goodProducts: res.good_products,
        hotProducts: res.hot_products,
        recentlyProducts: res.recently_products
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  },

  getPorducts(){
    var that = this;
      wx.request({
        url: util.apiUrl +'product/list_index.do',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res)
          console.log(res.data)
          console.log(res.data.goodProducts)
          console.log(res.data.hotProducts)
          console.log(res.data.recentlyProducts)

          that.setData({
            goodProducts: res.data.goodProducts,
            hotProducts: res.data.hotProducts,
            recentlyProducts: res.data.recentlyProducts
          });

        }
      })
  }

})
