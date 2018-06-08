// pages/memberCardActivation/memberCardActivation.js
var app = getApp()

Page({
    data: {
        type: 'password',
        src: '/images/icon_psw-default.png',
        inputPsw: '123456',
        cms_code: '',
        member_id: '',
        resultData: '',
    },

    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this, member_id = options.member_id, cms_code = wx.getStorageSync('cmsCode');
        this.setData({
            member_id: member_id,
            cms_code: cms_code
        })

        app.request(app.api.getCardsActiveInfoUrl, { member_id: member_id, cms_code: cms_code }, function (res) {
            if (res.code == 1) {
                var resultData = res.data;
                that.setData({
                    resultData: resultData
                })
            }
            wx.hideLoading()

        })


    },
    showPsw: function () {
        var type = 'password', src = '/images/icon_psw-default.png';
        this.setData({
            type: type == this.data.type ? 'text' : type,
            src: src == this.data.src ? '/images/icon_psw.png' : src
        })
    },
    inputPsw: function (e) {
        this.setData({
            inputPsw: e.detail.value
        })
    },

    // 点击激活的数据请求
    active: function () {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })

        if (this.data.inputPsw == '123456') {
            wx.showToast({
                title: '请修改密码',
                icon: 'none',
                duration: 2000
            })
        } else {
            app.request(app.api.getCardsActiveUrl, { card_password: that.data.inputPsw, member_id: that.data.member_id, cms_code: that.data.cms_code }, function (res) {

                if (res.code == 1) {
                    wx.switchTab({
                        url: '/pages/personCenter/personCenter',
                    })
                }
                wx.hideLoading()

            })
        }
    }
})