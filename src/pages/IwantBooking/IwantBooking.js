var app = getApp();

Page({
    data: {
        resultData: '',
        search_key: '',// 输入框中的值
        checkedSum: 0
    },

    // 页面加载时
    onLoad: function () {
        var that = this, cmsCode = wx.getStorageSync('cmsCode');
        // 请求首页预订类别列表的数据
        app.request(app.api.getBookListUrl, { cms_code: cmsCode }, function (res) {
            if (res.code == 1) {
                var resultData = res.data;
                wx.setStorageSync('isBindCard', resultData.can_used_card_num);//缓存用户会卡绑定状态
                that.setData({
                    resultData: resultData
                })
            }
        })
    },

    // bindKeyInput 
    bindKeyInput: function (e) {
        this.setData({
            search_key: e.detail.value
        })
    },

    // 点击搜索完成的时候
    bindconfirm: function(){
        wx.navigateTo({
            url: '/pages/searchResults/searchResults?search_key='+this.data.search_key,
        })
    },

    // bindChange 多选事件
    bindChange: function (e) {
        var checkedSum = 0, checkedArr = e.detail.value;
        console.log('checkedArr:');
        console.log(checkedArr);
        checkedArr.forEach(function (val, idx) {
            checkedSum += Number(checkedArr[idx]);
        });
        this.setData({
            checkedSum: checkedSum
        })
    },

    // 提交权益时，如果用户没有选择权益类别，提醒用户选择权益类别
    submitRights: function(){
        if (this.data.checkedSum == 0){
            wx.showToast({
                title: '请选择权益类别',
                icon: 'none',
                duration: 2000
            })
        }
    }
})