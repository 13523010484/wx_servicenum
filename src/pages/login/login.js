// pages/login/login.js
var app = getApp()
var interval = null //倒计时函数
var token = ''

Page({
    data: {
        show: false,
        time: '发送验证码', //倒计时 
        currentTime: 61,
        noSubmit: false,
        noEdit: false,
        code: '',//获取后台返回code
        mobile: '',//手机号
        check_code: '',//验证码
        token: ''// 发送验证码后的返回值
    },

    onLoad: function (options) {
        var that = this;
        //微信登录获取code
        app.getWxLogin(function (code) {
            that.setData({
                code: code
            })
        })
    },
    // 获取用户输入的手机号
    bindKeyInput: function (e) {
        var mobile = e.detail.value
        this.setData({
            mobile: mobile
        })
        if (mobile.length == 11) {
            this.setData({
                show: true
            })
        } else {
            this.setData({
                show: false
            })
        }
    },
    // 获取用户输入的验证码
    bindKeyCode: function (e) {
        this.setData({
            check_code: e.detail.value
        })
    },
    // 发送验证码
    getCode: function (options) {
        var that = this;
        var currentTime = that.data.currentTime
        var interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime + 's后重发',
                noSubmit: true
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: '发送验证码',
                    currentTime: 61,
                    disabled: false,
                    noSubmit: false
                })
            }
        }, 1000);
        // request 发送验证码
        var that = this
        app.request(app.api.sendCodeUrl, { mobile: this.data.mobile }, function (res) {
            if (res.code === 1) {
                that.setData({
                    token: res.data.token
                });
            }
        }, 'application/json', 'GET')
    },
    // 点击发送按钮事件
    sendCode() {
        this.getCode();
        var that = this
        that.setData({
            disabled: true,
            noEdit: true
        })
    },
    // 手机号绑定函数
    bindLogin: function () {
        // var cmsCode = getCurrentPages()[1].options.cms_code
        // console.log('上一页的cmsCode:'+cmsCode);
        var params = {
            mobile: this.data.mobile,
            check_code: this.data.check_code,
            token: this.data.token,
            wx_code: this.data.code
        }
        wx.showLoading({
            title: '绑定中...',
        })
        app.request(app.api.bindMobileUrl, params, function (res) {
            console.log('login cmsCode:')
            console.log(res);
            if (res.code == 1) {
                var cmsCode = res.data.cms_code;
                wx.hideLoading()
                wx.setStorageSync('cmsCode', cmsCode);// 账号绑定成功，缓存此时的cmsCode
                wx.redirectTo({
                    url: '/pages/bindSuccess/bindSuccess'
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.message,
                    showCancel: false
                })
            }
        }, 'application/json', 'GET')
    }
})