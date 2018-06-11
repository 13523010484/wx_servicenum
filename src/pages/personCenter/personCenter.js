//index.js
//获取应用实例
var app = getApp()

Page({
    data: {

    },

    onShow: function () {
        var cmsCode = wx.getStorageSync('cmsCode');
        if (!cmsCode) {
            wx.redirectTo({
                url: '/pages/login/login'
            })
        }
    },

    // 拨打客服电话
    call() {
        wx.makePhoneCall({
            phoneNumber: '4008885593'
        })
    },

    // 更新版本
    updateVersion: function () {
        // 获取小程序更新机制兼容
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
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '已经是最新版本了哦~',
                        showCancel: false
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
    },

    // 功能尚未做的提醒
    alert: function(){
        wx.showToast({
            title: '此功能尚未开发，敬请期待！',
            icon: 'none'
        })
    }
})