var app = getApp()

Page({
    data: {
        status: 2,
        status_data: [],// 点击时后台返回的数据
    },

    onShow: function (options) {
        var that = this;
        this.get_data(1, function (res) {
            if (res.code == 1) {
                that.group_book_id(res.data.listRights);
            }
        })
    },

    // 点击切换时的事件
    switchTab: function (e) {
        console.log(e);
        var that = this;
        if (e.target.id != this.data.status) {
            this.setData({
                status: e.target.id
            })
            this.get_data(1, function (res) {
                if (res.code == 1) {
                    // 将后台返回的数据根据book_id进行分组
                    that.group_book_id(res.data.listRights);
                }
            })
        }
    },

    // get_data 封装请求预订单列表的数据请求方法
    get_data(page, callback) {
        var that = this,
            cms_code = wx.getStorageSync('cmsCode'),
            params = {
                size: 15,
                page: page,
                status: this.data.status,// status 2表示待行权，8 已行权，32取消行权
                cms_code: cms_code
            };
        app.request(app.api.viewBookOrderListUrl, params, function (res) {
            callback(res)
        })
    },

    // 处理请求成功后返回的值，根据book_id分组
    group_book_id(back_data) {
        var that = this;
        var init_index = 0,
            status_data = [],
            results_data = back_data;

        // 日期降序排列
        results_data.sort(function (a, b) {
            return b.book_date > a.book_date;
        })

        // 按照book_id分组
        results_data.forEach(function (item, index) {
            if (index == 0) {
                status_data.push({
                    book_id: item.book_id,
                    book_arr: [item]
                })
            } else {
                var prev_index = results_data[index - 1];
                if (item.book_id == prev_index.book_id) {
                    status_data[init_index]['book_arr'].push(item)
                } else {
                    status_data.push({
                        book_id: item.book_id,
                        book_arr: [item]
                    })
                    init_index++
                }
            }
        })

        that.setData({
            status_data: status_data
        })
    }

})