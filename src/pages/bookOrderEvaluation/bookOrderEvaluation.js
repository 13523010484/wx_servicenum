var app = getApp()

Page({
    data: {
        cur_index_1: 0,
        cur_index_2: 0,
        cur_index_3: 0,
        cur_index_4: 0,
        cur_index_one: 0,
        cur_index_two: 0,
        cur_index_three: 0,
        cur_index_four: 0,
        img_arr_1: [1, 2, 3, 4, 5],
        img_arr_2: [6, 7, 8, 9, 10],
        img_arr_3: [11, 12, 13, 14, 15],
        img_arr_4: [16, 17, 18, 19, 20],
        result_list: '',// 评价数据初始化接口返回的值
        cms_code: '',
        options: {},
    },

    onLoad: function (options) {
        console.log('参数options:');
        console.log(options);
        var that = this,
            cms_code = wx.getStorageSync('cmsCode');

        this.setData({
            cms_code: cms_code,
            options: options
        })

        app.request(app.api.toEvaluateUrl, { cms_code: cms_code, cp_id: options.cp_id, book_order_id: '' }, function (res) {
            console.log('评价页面返回数据：');
            console.log(res);
            if (res.code == 1) {
                var result_list = res.data.d.list;

                that.setData({
                    result_list: result_list
                })
            }
        })
    },

    // 点击星星的评价： 服务
    starClick_1: function (e) {
        console.log('服务的星星：');
        console.log(e);
        this.setData({
            cur_index_1: parseInt(e.target.id),
            cur_index_one: e.currentTarget.dataset.arrOne
        });
    },

    // 点击星星的评价： 设施
    starClick_2: function (e) {
        console.log('设施的星星：');
        console.log(e);
        this.setData({
            cur_index_2: parseInt(e.target.id),
            cur_index_two: e.currentTarget.dataset.arrTwo
        });
    },

    // 点击星星的评价： 位置
    starClick_3: function (e) {
        console.log('位置的星星：');
        console.log(e);
        this.setData({
            cur_index_3: parseInt(e.target.id),
            cur_index_three: e.currentTarget.dataset.arrThree
        });
    },

    // 点击星星的评价： 卫生
    starClick_4: function (e) {
        console.log('卫生的星星：');
        console.log(e);
        this.setData({
            cur_index_4: parseInt(e.target.id),
            cur_index_four: e.currentTarget.dataset.arrFour
        });
    },

    // 表单提交
    formSubmit: function (e) {
        console.log('表单提交：');
        console.log(e);
        console.log(e.detail.value.checkbox.join());
        console.log(Math.floor(Number(this.data.cur_index_one + this.data.cur_index_two + this.data.cur_index_three + this.data.cur_index_four) / 5));
        var that = this,
            params = {
                resource_id: '',
                cp_comment_label_id: e.detail.value.checkbox.join(),
                service_star: this.data.cur_index_one,
                facility_star: this.data.cur_index_two,
                position_star: this.data.cur_index_three,
                health_star: this.data.cur_index_four,
                content: e.detail.value.note,
                server_ids: '',
                book_id: this.data.options.book_id,
                cp_id: this.data.options.cp_id,
                srnc_id: this.data.options.srnc_id,
                mrd_id: this.data.options.mrd_id,
                mcd_id: this.data.options.mcd_id,
                cms_code: this.data.cms_code
            };

        console.log(this.data.options);

        app.request(app.api.submitEvaluateUrl, params, function (res) {
            console.log('提交评价的接口：');
            console.log(res);
            if(res.code == 1){
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000,
                    success: function(){
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                })
            }

        })

    }
})