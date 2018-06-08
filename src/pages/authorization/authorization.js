// pages/authorization/authorization.js
Page({
      data: {
            srcReduce: '/images/icon_cut-down.png',
            srcIncrease: '/images/icon_add-to.png',
            num: 1
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function () {
      },
      Reduce: function (e) {
            console.log(this);
            var num = num - 1;
            this.setData({
                  num: this.data.num
            })
      },
      Increase: function () {
            console.log(this);
            var num = num + 1;
            this.setData({
                  num: num
            })
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function () {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {

      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function () {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function () {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function () {

      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})