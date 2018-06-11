var app = getApp()

Page({
    data: {
        resultData: [],// 返回会卡列表的数据
    },

    onLoad: function () {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this, cms_code = wx.getStorageSync('cmsCode');

        app.request(app.api.getCardsListUrl, { cms_code: cms_code }, function (res) {
            console.log('我的会员卡');
            console.log(res);
            if (res.code == 1) {
                var resultData = res.data;
                that.setData({
                    resultData: resultData
                })
            }
            wx.hideLoading();
        })
    }
})