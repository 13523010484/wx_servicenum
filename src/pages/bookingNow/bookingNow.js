var app = getApp()

Page({
    data: {
        interval: 5000,
        duration: 1000,
        results: '',
        phoneNumber: ''
    },

    // 页面初始加载时
    onLoad: function (options) {
        var that = this, cms_code = wx.getStorageSync('cmsCode');
        var params = {
            card_type_id: options.card_type_id,
            cp_id: options.cp_id,
            mrd_id: options.mrd_id,
            order_category: options.order_category,
            srnc_id: options.srnc_id,
            cms_code: cms_code
        };

        app.request(app.api.canBookRightsDetailUrl, params, function (res) {
            if (res.code == 1) {
                var results = res.data;
                that.setData({
                    results: results
                })
            }
        })

    },

    // 拨打电话
    makePhoneCall: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.results.right.mobile,
            success: function (res) {
                console.log('用户点击了确定按钮：');
                console.log(res.errMsg);
            },
            fail: function (res) {
                console.log('用户点击了取消按钮：');
                console.log(res.errMsg);
            }
        })
    }

})