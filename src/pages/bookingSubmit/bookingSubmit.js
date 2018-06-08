var app = getApp()

Page({
    data: {
        results_data: '',// 提交预订单成功后返回的数据
        cms_code: '',
        status: '',
        book_id: '',
        params: {},
    },

    // 声明周期，监听页面加载
    onLoad: function (options) {
        console.log('跳转到提交预订页面：');
        console.log(options);
        var that = this,
            cms_code = wx.getStorageSync('cmsCode');

        this.setData({
            cms_code: cms_code, // 更新cms_code
            status: options.status // 更新状态
        })

        /**
         *  options.status = '64' 由预订单页面提交预订按钮进入，此页面底部显示"提交预订"的按钮
         *  options.status = '128' 由购物车列表页面的提交按钮进入，此页面底部显示"提交预订"的按钮
         *  options.status options.status = 2 此页面底部显示"取消预订"的按钮
         *  options.status options.status = 8 || options.status = 32 此页面底部不显示按钮
         * 
         * **/

        if (options.status == '64') {
            var right_list = [{
                card_type_id: options.card_type_id,
                cp_id: options.cp_id,
                mrd_id: options.mrd_id,
                srnc_id: options.srnc_id,
                "string": options.string ? options.string : ''
            }];

            // 从购物车提交预订时的接口请求；以及从预订页面以及预订时的接口请求
            this.submit_booking(app.api.submitCartsUrl, JSON.stringify(right_list), function (res) {
                if (res.code == 1) {
                    var results_data = res.data;

                    that.setData({
                        results_data: results_data
                    })
                }
            })
        } else if (options.status == '128') {
            var results_data = JSON.parse(options.submit_data);
            this.setData({
                results_data: results_data
            })
        } else if ((options.status == '2') || (options.status == '8') || (options.status == '32')) {
            // 从待行权页面进入到取消预订单的详情页面
            var params = {
                book_id: options.book_id,
                order_category: options.order_category,
                card_type_id: options.card_type_id,
                cp_id: options.cp_id,
                mrd_id: options.mrd_id,
                srnc_id: options.srnc_id,
                status: options.status,
                cms_code: cms_code
            };

            this.setData({
                params: params
            })
            // 从待行权页面进入到取消订单页面的接口请求
            app.request(app.api.cancelBookDetailUrl, params, function (res) {
                console.log('取消预订单详情页面：');
                console.log(res);
                if (res.code == 1) {
                    var results_data = {
                        curRights_list: [res.data.curRights]
                    };
                    results_data.curRights_list[0].timePersons = res.data.timePersons;

                    that.setData({
                        results_data: results_data
                    })
                }

            })
        }
    },

    // 提交预订
    submit: function () {
        var that = this;
        this.submit_booking(app.api.submitBookOrderUrl, this.data.results_data.right_list, function (res) {

            if (res.code == 1) {
                wx.navigateTo({
                    url: '/pages/bookingSuccess/bookingSuccess',
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.message,
                    showCancel: false
                })
            }
        })
    },

    // 取消预订
    cancelsubmit: function () {

        var that = this;
        var right_list_arr = [{
            card_type_id: this.data.params.card_type_id,
            cp_id: this.data.params.cp_id,
            mrd_id: this.data.params.mrd_id,
            srnc_id: this.data.params.srnc_id
        }]

        var params = {
            right_list: JSON.stringify(right_list_arr),
            book_id: this.data.params.book_id,
            cms_code: this.data.cms_code
        };

        console.log(params);

        app.request(app.api.cancelSubmitUrl, params, function (res) {
            console.log('取消订单：');
            console.log(res);
            if (res.code == 1) {
                wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.message,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    }
                })
            }
        })
    },

    // submit_booking把提交预订封装成方法
    submit_booking(url, right_list, callback) {
        var that = this,
            cms_code = wx.getStorageSync('cmsCode'),
            params = {
                right_list: right_list,
                cms_code: cms_code
            };

        app.request(url, params, function (res) {
            callback(res);
        })
    }

})