// pages/getUserPhoneNumber/getUserPhoneNumber.js
var app = getApp()
const getMobileUrl = app.api.getMobileUrl

Page({
    data: {
        cmsCode: ''
    },

    // 页面加载时
    onLoad: function (options) {
        this.setData({
            cmsCode: options.cms_code
        })
    },

    // 获取用户手机号的接口请求
    getPhoneNumber: function (e) {
        var that = this;

        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            // 用户拒绝获取手机号，跳转至账号绑定页面
            wx.redirectTo({
                url: '/pages/login/login',
            })
        } else {
            // 用户允许获取手机号，判断用户手机号是否已绑定，是：跳转至我要预订页面，否：跳转至账号绑定页面
            wx.login({
                success: function (res) {
                    var wx_code = res.code;

                    if (wx_code) {
                        app.request(getMobileUrl, { 'encryptedData': encodeURIComponent(e.detail.encryptedData), 'iv': e.detail.iv, 'cms_code': that.data.cmsCode }, function (ret) {
                            console.log('允许获取手机号成功时返回的数据！！！！');
                            console.log(ret)
                            if (ret.code == 1) {
                                var cmsCode = ret.data.cms_code;
                                wx.setStorageSync('cmsCode', cmsCode);//账号绑定成功时缓存cmsCode
                                wx.switchTab({
                                    url: '/pages/IwantBooking/IwantBooking',
                                })
                            }
                        }, '', 'GET')
                    }
                }
            })
        }
    },
    // 用户拒绝获取手机号，跳转至预订页面
    jumpLoginPage() {
        wx.redirectTo({
            url: '/pages/login/login',
        })
    }
})