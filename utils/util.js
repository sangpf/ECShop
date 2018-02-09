const apiUrl = 'http://sking.online/';  //接口地址

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, method = 'GET', data = {}) {
  let header = {
    'content-type': 'application/json',
    'X-ECAPI-Sign': '',
    'X-ECAPI-UDID': '',
    'X-ECAPI-UserAgent': 'Platform/Wechat',
    'X-ECAPI-Ver': '1.1.0'
  };

  let token = wx.getStorageSync('token') || '';
  if (token) {
    header['X-ECAPI-Authorization'] = token
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        if (res.data.error_code === 0) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络加载失败'
        });

    //显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
        // wx.showLoading({
        //   title: 'hello',
        // });
        
    //wx.showModal(OBJECT) ​显示模态弹窗
        // wx.showModal({
        //   title: '​显示模态弹窗',
        //   content: '确认',
        // })

//wx.showActionSheet(OBJECT) 显示操作菜单
      // wx.showActionSheet({
      //   itemList: ['A', 'B', 'C'],
      //   success: function (res) {
      //     console.log(res.tapIndex)
      //   },
      //   fail: function (res) {
      //     console.log(res.errMsg)
      //   }
      // })

      }
    });
  });
}

// 显示消息提示框
function showToast(title, type = 'error') {
  let image = '';
  switch (type) {
    case 'error':
      image = '/images/icon_error.png'
      break;
    case 'success':
      image = '/images/icon_success.png'
      break;
    case 'warning':
      image = '/images/icon_warning.png'
      break;
  }
  wx.showToast({
    title: title,
    image: image,
    duration: 0,
    mask: true,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

module.exports = {
  formatTime: formatTime,
  request: request,
  showToast: showToast,
  apiUrl: apiUrl,
}

