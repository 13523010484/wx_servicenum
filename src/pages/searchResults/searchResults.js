var app = getApp()

Page({
    data: {
        tab_status: 0,
        search_key: '',
        cms_code: '',
        results: ''
    },

    // 页面加载时的数据请求
    onLoad: function (options) {
        var cms_code = wx.getStorageSync('cmsCode');
        console.log('搜索的接口获取cms_code:');
        console.log(cms_code);
        this.setData({
            search_key: options.search_key,
            cms_code: cms_code
        })
        this.get_data(options.options, this.data.cms_code);
    },

    // 点击tab切换时，发生的数据请求
    switchTab: function (e) {
        console.log(e)
        var that = this;
        if (e.target.id != this.data.tab_status) {
            this.setData({
                tab_status: e.target.id
            })
            this.get_data(this.data.search_key, this.data.cms_code);
        }
    },

    // tab切换的数据请求
    get_data(search_key, cms_code) {
        var that = this;
        app.request(app.api.searchKeysUrl, { search_key: search_key, cms_code: cms_code }, function (res) {
            console.log('搜索的接口请求之后返回的数据');
            console.log(res);
            if (res.code == 1) {
                var results = res.data;
                console.log('results:');
                console.log(results);
                that.setData({
                    results: results
                })
            }

        })
    },

    // 会卡绑定状态，用户已绑会员卡，跳转到购物车页面；如果尚未绑定，是否跳转到会卡列表页面
    isBindCard: function () {
        var isBindCard = wx.getStorageSync('isBindCard');
        if (!isBindCard) {
            wx.showModal({
                title: '提示',
                content: '您还未绑定会员卡，是否立即去绑定！',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '/pages/memberCard/memberCard',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    }
})