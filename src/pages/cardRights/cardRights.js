var app = getApp()

Page({
    data: {
        resultData: []
    },

    onLoad: function (options) {
        var that = this,
            member_id = options.member_id,
            cms_code = wx.getStorageSync('cmsCode');

        app.request(app.api.getCardsRightsUrl, { member_id: member_id, cms_code: cms_code }, function (res) {
            console.log('卡权益返回的数据：');
            console.log(res);
            if (res.code == 1) {
                var resultData = res.data.rights;
                that.setData({
                    resultData: resultData
                })
            }

        })

    }

})