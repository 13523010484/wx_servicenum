var app = getApp()


Page({
    data: {
        // showSearchIcon: true,
        search_key: '',// 输入框中的值
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0,//tab标题的滚动条位置
        navList: [],//返回导航的数据
        contentEveryList: [],//点击每个导航返回的数据
        order_category: '',
        cms_code: '',
        navIdxArr: [],//用来盛放点击导航底部内容循环次数的数组
    },

    onLoad: function (options) {
        var order_category = options.order_category, cms_code = wx.getStorageSync('cmsCode');
        var that = this;
        this.setData({
            order_category: order_category,
            cms_code: cms_code
        })
        // 高度自适应
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 100;

                that.setData({
                    winHeight: calc
                });
            }
        });

        // 可用消费点页面加载时的接口请求
        app.request(app.api.submitBookListUrl, { order_category: order_category, cms_code: cms_code }, function (res) {

            if (res.code == 1) {
                var navList = res.data.list;
                var navIdxArr = [];

                navList.forEach(function (val, idx) {
                    navIdxArr.push(idx);
                })

                that.setData({
                    navList: navList,
                    navIdxArr: navIdxArr
                })

                // 默认显示第一导航下的列表内容
                if (navList[0].cp_id && navList[0].cp_id != '') {
                    var cp_id = navList[0].cp_id;

                    that.getContentList(navList[0].cp_id, function (res) {
                        if (res.code == 1) {
                            var contentEveryList = res.data;
                            that.setData({
                                contentEveryList: contentEveryList
                            })
                        }
                    })
                }
            }
        })
    },

    // 点击标题切换当前页时改变样式
    switchNav: function (e) {
        var that = this, cur = e.target.dataset.current;

        if (this.data.currentTaB == cur) {
            return false;
        } else {
            that.getContentList(that.data.navList[cur].cp_id, function (res) {
                if (res.code == 1) {
                    var contentEveryList = res.data;
                    that.setData({
                        contentEveryList: contentEveryList,
                        currentTab: cur
                    })
                }
            })
        }
    },

    // 封装内容列表请求的接口
    getContentList(cp_id, callback) {
        var that = this;
        var params = {
            order_category: this.data.order_category,
            cms_code: this.data.cms_code,
            cp_id: cp_id
        }
        app.request(app.api.canBookRightsUrl, params, function (res) {
            return callback(res)
        })
    },

    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
    },

    // input 键盘输入时触发的事件
    bindKeyInput: function (e) {
        this.setData({
            // showSearchIcon: false,
            search_key: e.detail.value
        })
    },

    // 点击搜索完成的时候
    bindconfirm: function () {
        wx.navigateTo({
            url: '/pages/searchResults/searchResults?search_key=' + this.data.search_key,
        })
    },

    // 会卡绑定状态，用户已绑会员卡，跳转到购物车页面；如果尚未绑定，是否跳转到会卡列表页面
    isBindCard: function (e) {
        console.log(e);
        var isBindCard = wx.getStorageSync('isBindCard');
        if (!isBindCard) {
            wx.showModal({
                title: '提示',
                content: '您还未绑定会员卡，是否立即去绑定！',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '/pages/memberCard/memberCard'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '/pages/bookingSelectDate/bookingSelectDate?order_category=' + e.currentTarget.dataset.orderCategory + '&srnc_id=' + e.currentTarget.dataset.srncId + '&cp_id=' + e.currentTarget.dataset.cpId + '&mrd_id=' + e.currentTarget.dataset.mrdId + '&card_type_id=' + e.currentTarget.dataset.card_typeId
            })
        }
    }

})