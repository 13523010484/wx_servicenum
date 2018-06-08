var app = getApp()

Page({
    data: {
        resultData: [],// 返回会卡列表的数据
    },

    onLoad: function () {
        var that = this, cms_code = wx.getStorageSync('cmsCode');

        app.request(app.api.getCardsListUrl, { cms_code: cms_code }, function (res) {
            console.log('我的会员卡');
            console.log(res);
            if (res.code == 1) {
                var resultData = res.data.list;
                that.setData({
                    resultData: resultData
                })
            }

        })
    }
})