//app.js
const api = require('./config.js')

App({
    api: api,
    globalData: {
    },
    onLaunch: function () {

        // 版本更新
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }

        var self = this, cmsCode = wx.getStorageSync('cmsCode');
        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (wx_code) {
                    wx.request({
                        url: self.api.checkBindUrl,
                        data: { wx_code: wx_code },
                        method: 'GET',
                        success: function (res) {
                            var body = res.data, cmsCode = body.data.cms_code;

                            // code=0的时候，返回用户尚未绑定，跳转到获取手机号的页面，
                            // code=1的时候，用户绑定成功，缓存cmsCode
                            if (body.code == 1) {
                                wx.setStorageSync('cmsCode', cmsCode);// 用户已经绑定，缓存cmsCode
                                wx.switchTab({
                                    url: '/pages/IwantBooking/IwantBooking',
                                })
                            } else {
                                wx.redirectTo({
                                    // 用户尚未进行绑定，跳转到获取用户手机号的页面
                                    url: '/pages/getUserPhoneNumber/getUserPhoneNumber?cms_code=' + cmsCode
                                })
                                console.log('应用启动的时候将cmsCode传递到获取手机号的页面！！！');
                                console.log(cmsCode);
                            }
                        },
                        fail: function (res) {
                            console.log('fail');
                        }
                    })
                }
            }
        })
    },
    request(url, param, callback, header, method) {
        wx.request({
            url: url,
            data: param,
            method: method || 'POST',
            dataType: 'json',
            header: {
                'Content-Type': header || 'application/x-www-form-urlencoded'
            },
            success: function (ret) {
                wx.hideLoading()
                var body = ret.data;
                return typeof callback == "function" && callback(body)
            },
            fail: function (ret) {
                wx.hideLoading()
                wx.showModal({
                    title: '提示',
                    content: ret.message,
                })
            }
        })
    },
    // 微信登录 
    getWxLogin: function (callback) {
        var self = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    callback(res.code)
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            },
            fail: function (err) {
                console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                callback(err)
            }
        })
    },
})