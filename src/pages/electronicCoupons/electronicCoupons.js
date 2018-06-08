// pages/electronicCoupons/electronicCoupons.js
Page({
    data: {
        tab_status: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    switchTab: function (e) {
        this.setData({
            tab_status: e.target.id
        })
    }
})