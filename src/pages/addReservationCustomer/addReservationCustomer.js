// pages/addReservationCustomer/addReservationCustomer.js
var app = getApp()
Page({
    data: {
        items: [
            { name: 'female', value: '女', checked: 'true' },
            { name: 'male', value: '男' }
        ],
        inputTel: '',
        gender: 'female'
        // hidden: true
    },
    // 获取手机号
    inputTel: function (e) {
        this.setData({
            inputTel: e.detail.value
        })
    },
    // 点击校验，验证手机号
    btnCheck: function () {
        console.log(this.data.inputTel);
        var telNum = this.data.inputTel, mobilevalid = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}(.){0,20}$/;
        if (!mobilevalid.test(telNum)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'loading',
                duration: 2000
            })
        } else if (telNum == '13523010484') {
            wx.showToast({
                title: '不要给自己授权！',
                icon: 'loading',
                duration: 2000
            })
        } else {
            //点击校验发送请求
            app.request(app.globalData.host + '/wxs/mobile/personal/homepage?act=do_check', { tel: telNum }, '', function (res) {
                console.log(res);
                // this.setData({
                //       hidden: true
                // })
            })
        }

    },
    // 单选按钮
    radioChange: function (e) {
        this.setData({
            gender: e.detail.value
        })
    },

    // 添加
    addTo: function () {
        console.log(this);
        //点击校验发送请求
        app.request(app.globalData.host + '/wxs/mobile/personal/homepage?act=add_app', { tel: this.data.inputTel, name: 'name', gender: this.data.gender }, '', function (res) {
            console.log(res);
            wx.navigateTo({
                url: '../reservationAuthorizationList/reservationAuthorizationList',
            })
        })
    }
})