// pages/addShoppingCart/addShoppingCart.js
Page({
    data: {
        num: 0,
        srcReduce: '/images/icon_cut-down.png',
        srcIncrease: '/images/icon_add-to-active.png',
        checkBoxArr: [
            { name: 'noHot', value: '不吃辣' },
            { name: 'noGarlic', value: '不吃蒜', checked: 'true' },
            { name: 'noPrime', value: '不吃姜' },
            { name: 'noPrime', value: '不喝汤' },
            { name: 'noPrime', value: '不吃菜' }
        ]
    },
    onLoad: function (options) {

    },
    // 自减事件
    Reduce: function (e) {
        var num = this.data.num;
        if (num > 0) {
            num--;
        }
        var src = num > 1 ? '/images/icon_cut-down-active.png' : '/images/icon_cut-down.png'
        this.setData({
            num: num,
            srcReduce: src
        });
    },
    // 自增事件
    Increase: function () {
        var num = this.data.num;
        num++;
        var src = num > -1 ? '/images/icon_cut-down-active.png' : '/images/icon_cut-down.png'
        this.setData({
            num: num,
            srcReduce: src
        });
    },
    // num更新数量的变化
    bindNum: function () {
        var num = e.detail.value;
        this.setData({
            num: num
        });
    }
})