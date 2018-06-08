// pages/bindCancle/bindCancle.js
var app = getApp()

Page({
    data: {
    },
    // 解除绑定的请接口请求
    bindCancel: function () {
        var cmsCode = wx.getStorageSync('cmsCode');
        
        app.request(app.api.cancelBindUrl, { cms_code: cmsCode }, function (res) {
            console.log('解除绑定时后台返回的数据！！！！');
            console.log(res);
            if (res.code == 1) {
                wx.redirectTo({
                    url: '/pages/login/login',//跳转到获取用户手机号页面
                })
                // 解除绑定，清空本地缓存的cmsCode
                wx.clearStorage('cmsCode')// 清除本地缓存
            } else {
                // 解除绑定失败时的错误提醒
                wx.showModal({
                    title: '提示',
                    content: res.message,
                    showCancel: false
                })
            }
        })
    }
})