var app = getApp()

Page({
    data: {
        cms_code: '',
        carts_results: [],// 购物车列表返回的数据
        selectAllStatus: false,// 全选状态，默认全选
    },

    // onLoad 页面加载时
    onLoad: function () {
        var that = this, cms_code = wx.getStorageSync('cmsCode');
        this.setData({
            cms_code: cms_code
        })

        app.request(app.api.addCartsUrl, { cms_code: cms_code }, function (res) {

            if (res.code == 1) {
                var carts_results = res.data.list;

                carts_results.forEach(function (item, index) {
                    item.selected = false;
                    if ((item.order_category == 8) || (item.order_category == 16)) {
                        item.category_name = item.category_name.substring(0, 1);
                    } else {
                        item.category_name = item.category_name.substring(1, 2);
                    }
                })
                that.setData({
                    carts_results: carts_results
                })
            }
        })
    },

    // 单前列表选中的事件
    selectList(e) {
        var id = e.target.id,
            carts_results = this.data.carts_results,
            selected = carts_results[id].selected;

        carts_results[id].selected = !selected;

        this.setData({
            carts_results: carts_results
        });
    },

    // 全选事件
    selectAll(e) {
        var that = this,
            selectAllStatus = this.data.selectAllStatus,
            carts_results = this.data.carts_results;

        selectAllStatus = !selectAllStatus;

        carts_results.forEach(function (item, index) {
            item.selected = selectAllStatus
        })

        this.setData({
            selectAllStatus: selectAllStatus,
            carts_results: carts_results
        });
    },

    // 删除当前列表
    deleteList(e) {
        var that = this,
            cur_index = e.currentTarget.dataset.index,
            carts_results = this.data.carts_results,
            params = {};

        params = {
            mrd_id: carts_results[cur_index].mrd_id,
            srnc_id: carts_results[cur_index].srnc_id,
            card_type_id: carts_results[cur_index].mcd_id,
            cp_id: carts_results[cur_index].cp_id,
            book_id: carts_results[cur_index].book_id,
            cms_code: this.data.cms_code
        };

        wx.showModal({
            title: '提示',
            content: '确定要删除该预订吗？',
            success: function (res) {
                if (res.confirm) {
                    app.request(app.api.deleteCartsUrl, params, function (res) {
                        if (res.code == 1) {
                            carts_results.splice(cur_index, 1);
                            that.setData({
                                carts_results: carts_results
                            });
                        }
                    })
                } else {
                    console.log('用户点击了取消按钮！！！');
                    console.log(res)
                }
            }
        })
    },

    // 购物车提交
    submit: function (e) {
        var carts_results = this.data.carts_results;
        var right_list_arr = [];
        carts_results.forEach(function (item, index) {
            if (item.selected) {
                right_list_arr.push({
                    srnc_id: item.srnc_id,
                    mrd_id: item.mrd_id,
                    cp_id: item.cp_id,
                    card_type_id: item.mcd_id,
                    'string': item.string
                })
            }
        })

        var that = this,
            params = {
                right_list: JSON.stringify(right_list_arr),
                cms_code: this.data.cms_code
            };

        if (right_list_arr.length > 0) {
            app.request(app.api.submitCartsUrl, params, function (res) {
                if (res.code == 1) {
                    var submit_data = JSON.stringify(res.data);
                    wx.navigateTo({
                        url: '/pages/bookingSubmit/bookingSubmit?submit_data=' + submit_data + '&status=' + '128',
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.message,
                        showCancel: false
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '请至少选择一个权益提交！',
                showCancel: false
            })
        }
    }
})