// pages/startPages/startPages.js
Page({
    data: {
    },
    // 数据初始化加载时：
    onLoad: function () {
        setInterval(function () {
            wx.switchTab({
                url: '/pages/IwantBooking/IwantBooking'
            })
        }, 3000)
    }
})