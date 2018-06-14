// var host = 'https://cmswx.orenda.com.cn'
var host = "http://192.16.8.40:8083"

var config = {
    host: host,

    // 检测接口
    checkBindUrl: `${host}/wxsapp/v2/p/common?act=check_bind`,

    // 获取用户手机号
    getMobileUrl: `${host}/wxsapp/v2/p/common?act=get_mobile`,
 
    // 发送验证码
    sendCodeUrl: `${host}/wxsapp/v2/p/common?act=send_code`,

    // 绑定手机号
    bindMobileUrl: `${host}/wxsapp/v2/p/common?act=bind_mobile`,

    // 解除绑定
    cancelBindUrl: `${host}/wxsapp/v2/m/base?act=cancel_bind`,

    // 首页获取预订权益类别列表
    getBookListUrl: `${host}/wxsapp/v2/m/bookOrder?act=getbookorderbropertylist`,

    // 首页确定权益类别
    submitBookListUrl: `${host}/wxsapp/v2/m/bookOrder?act=available_cp`,

    // 获取可消费点内容列表
    canBookRightsUrl: `${host}/wxsapp/v2/m/bookOrder?act=can_book_rights`,

    // 可消费点内容列表图文详情
    canBookRightsDetailUrl: `${host}/wxsapp/v2/m/bookOrder?act=right_details`,

    // 我的会卡列表
    getCardsListUrl: `${host}/wxsapp/v2/m/personal?act=get_cards`,

    // 我的会卡激活信息
    getCardsActiveInfoUrl: `${host}/wxsapp/v2/m/personal?act=get_card`,

    // 我的会卡激活
    getCardsActiveUrl: `${host}/wxsapp/v2/m/personal?act=active`,

    // 我的会卡卡权益
    getCardsRightsUrl: `${host}/wxsapp/v2/m/personal?act=get_member_rights`,

    // 首页搜索的接口
    searchKeysUrl: `${host}/wxsapp/v2/m/bookOrder?act=query`,

    // 权益详情页立即预订
    bookNowUrl: `${host}/wxsapp/v2/m/bookOrder?act=add_book`,

    // 获取日历的组件
    getCalendarUrl: `${host}/wxsapp/v2/m/bookOrder?act=get_book_calendar`,

    // 游玩类预订时间段，上午、中午、下午
    getBookPeriodUrl: `${host}/wxsapp/v2/m/bookOrder?act=get_play_right_book_time`,

    // 提交预订、加入购物车的接口
    submitBookUrl: `${host}/wxsapp/v2/m/bookOrder?act=save_to_buy_car`,

    // 加入购物车的接口
    addCartsUrl: `${host}/wxsapp/v2/m/bookOrder?act=to_shopping_car_page`,

    // 删除购物车列表的接口
    deleteCartsUrl: `${host}/wxsapp/v2/m/bookOrder?act=del_book_rights`,

    // 购物车提交接口
    submitCartsUrl: `${host}/wxsapp/v2/m/bookOrder?act=all_right_order_confirm`,

    // 购物车提交确认接口
    submitBookOrderUrl: `${host}/wxsapp/v2/m/bookOrder?act=submit_book_order`,

    // 查看预订单的接口
    viewBookOrderListUrl: `${host}/wxsapp/v2/m/personal?act=get_my_orders_data`,

    // 取消预订单的接口
    cancelSubmitUrl: `${host}/wxsapp/v2/m/bookOrder?act=cancel_book_order`,

    // 取消预订单数据初始化的接口
    cancelBookDetailUrl: `${host}/wxsapp/v2/m/bookOrder?act=right_order_detail`,

    // 评价页面数据初始化的接口
    toEvaluateUrl: `${host}/wxsapp/v2/m/personal?act=to_evaluate`,

    // 评价页面提交评价的接口
    submitEvaluateUrl: `${host}/wxsapp/v2/m/personal?act=save_tags`,

    // 场地类获取包间的接口
    getRoomUrl: `${host}/wxsapp/v2/m/bookOrder?act=ground_period_house`,

    // 用餐类获取用餐时间的接口
    getDinnerTimeUrl: `${host}/wxsapp/v2/m/bookOrder?act=dinner_period_house`,

}
module.exports = config