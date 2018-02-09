var app = getApp();
var util = require('../../../utils/util.js');
var WxParse = require('../../../libs/wxParse/wxParse.js');

Page({
  data: {
    id: 0,
    goods: {
      name:'LANCOME兰蔻小黑瓶精华肌底液',
      current_price:99
    },
    gallery: [
      {
        large: '../../../resources/detail/11.jpg'
      },
      {
        large: '../../../resources/detail/12.jpg'
      },
      {
        large: '../../../resources/detail/13.jpg'
      }
    ],
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,

    // 商品详情介绍
    detailImg: [
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_1.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_2.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_3.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_4.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_5.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_6.jpg",
    ],
  },

  onLoad: function (options) {
    console.log("id:"+options.id)
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
    });
    var id = options.id;
    this.getProductInfo(id);
    // this.getCartCount();
  },

  getProductInfo:function(id){
     //显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
     wx.showLoading({
       title: '加载中...',
     });
     let that = this;
     wx.request({
       url: util.apiUrl + 'product/product_detail.do',
       data:{
          pId : id
       },
       header: {
         "Content-Type": "application/json"
       },
       success: function (res) {
         console.log(res.data)
         that.setData({
           goods: res.data,
           gallery: res.data.imgs,  // 主图
           specificationList: specificationList,
           productList: res.product.stock,
           userHasCollect: res.product.is_liked,
           detailImg: res.data.product.detailImgList
         });
       }
     })
  },

// 获取商品详情  old
  getProductInfo_bak: function () {
    //显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    // var article = '<div>我是HTML代码</div>';
    // WxParse.wxParse('goodsDetail', 'html', article, that);

    util.request(util.apiUrl + 'ecapi.product.get', 'POST', { product: that.data.id }).then(function (res) {
      if (res.error_code === 0) {

        let specificationList = [];
        if (res.product.properties) {
          specificationList = res.product.properties.map(v => {
            v.checked = false;
            return v;
          });
        }

        that.setData({
          goods: res.product,
          gallery: res.product.photos,
          specificationList: specificationList,
          productList: res.product.stock,
          userHasCollect: res.product.is_liked
        });

        WxParse.wxParse('goodsDetail', 'html', res.product.goods_desc, that);
        //that.getGoodsRelated();
      }
      //隐藏 loading 提示框
      wx.hideLoading();
    });

  },

  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },

  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].id == specNameId) {
        for (let j = 0; j < _specificationList[i].attrs.length; j++) {
          if (_specificationList[i].attrs[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].attrs[j].checked) {
              _specificationList[i].attrs[j].checked = false;
            } else {
              _specificationList[i].attrs[j].checked = true;
            }
          } else {
            _specificationList[i].attrs[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].attrs.length; j++) {
        if (_specificationList[i].attrs[j].checked) {
          _checkedObj.valueId = _specificationList[i].attrs[j].id;
          _checkedObj.valueText = _specificationList[i].attrs[j].attr_name;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },

  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('|');
  },
 
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_attr == key) {
        return true;
      } else {
        return false;
      }
    });
  },

//获取购物车数量
  getCartCount(){
    var that = this;
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then(function (res) {
      that.setData({
        cartGoodsCount: res.goods_groups[0].total_amount || 0
      });
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  goodsCollect: function () {
    let that = this;
    let collectUrl = that.data.userHasCollect === false ? 'ecapi.product.like' : 'ecapi.product.unlike';
    util.request(util.apiUrl + collectUrl, 'POST', { product: this.data.id }, "POST")
        .then(function (res) {
          that.setData({
            userHasCollect: res.is_liked
          })
        });
  },

// 添加商品到购物车
  addToCart:function(event){
    console.log(event)
    var id = event.currentTarget.id
    console.log("id 为 : "+id)
    var name = event.currentTarget.dataset.userName;
    console.log(name);

    wx.request({
      url: util.apiUrl + 'product/addProductToCart',
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/json"
      },
      success:function(res){
          console.log(res.data);
      }
    })

  },

  // 加入购物车
  addToCart_old: function () {
    var that = this;

    if (this.data.specificationList.length > 0 ) {
      
      //提示选择完整规格
      if (this.isCheckedAllSpec()) {
        util.showToast('请选择规格', 'error');
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        util.showToast('规格不存在', 'error');
        return false;
      }

      //验证库存
      if (checkedProduct.stock_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showToast('商品售完', 'error');
        return false;
      }
      let property = checkedProduct[0].goods_attr;
      property = '[' + property.replace("|", ",") + ']';
      //添加到购物车
      util.request(util.apiUrl + 'ecapi.cart.add', "POST", { amount: this.data.number, product: this.data.goods.id, property: property })
        .then(function (res) {
          util.showToast('加入购物车成功', 'success')
          this.getCartCount();
        }).catch(err => {
          util.showToast(err.error_desc, 'error')
        });
    } else {
      //验证库存
      
      if (this.data.goods.good_stock < this.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showToast('商品售完', 'error');
        return false;
      }

      //添加到购物车
      util.request(util.apiUrl + 'ecapi.cart.add', "POST", { amount: this.data.number, product: this.data.goods.id, property: "[]" })
        .then(function (res) {
          util.showToast('加入购物车成功', 'success')
          this.getCartCount();
        }).catch(err => {
          util.showToast(err.error_desc, 'error')
        });
    }
    
  },

  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  }
})