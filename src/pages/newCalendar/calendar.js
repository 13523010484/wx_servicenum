// pages/calendar/calendar.js
Page({
    data: {
        week: { hasErrors: false, data: [{ book_time: '2018-05-18 00:00:00', info: '有' }, { book_time: '2018-05-19 00:00:00', info: '有' }, { book_time: '2018-05-20 00:00:00', info: '有' }, { book_time: '2018-05-21 00:00:00', info: '有' }, { book_time: '2018-05-22 00:00:00', info: '有' }, { book_time: '2018-05-23 00:00:00', info: '有' }, { book_time: '2018-05-24 00:00:00', info: '有' }, { book_time: '2018-05-25 00:00:00', info: '有' }, { book_time: '2018-05-26 00:00:00', info: '有' }, { book_time: '2018-05-27 00:00:00', info: '有' }, { book_time: '2018-05-28 00:00:00', info: '有' }, { book_time: '2018-05-29 00:00:00', info: '有' }, { book_time: '2018-05-30 00:00:00', info: '有' }, { book_time: '2018-05-31 00:00:00', info: '有' }, { book_time: '2018-06-01 00:00:00', info: '有' }, { book_time: '2018-06-02 00:00:00', info: '有' }, { book_time: '2018-06-03 00:00:00', info: '有' }, { book_time: '2018-06-04 00:00:00', info: '有' }, { book_time: '2018-06-05 00:00:00', info: '有' }, { book_time: '2018-06-06 00:00:00', info: '有' }, { book_time: '2018-06-07 00:00:00', info: '有' }, { book_time: '2018-06-08 00:00:00', info: '有' }, { book_time: '2018-06-09 00:00:00', info: '有' }, { book_time: '2018-06-10 00:00:00', info: '有' }, { book_time: '2018-06-11 00:00:00', info: '有' }, { book_time: '2018-06-12 00:00:00', info: '有' }, { book_time: '2018-06-13 00:00:00', info: '有' }, { book_time: '2018-06-14 00:00:00', info: '有' }, { book_time: '2018-06-15 00:00:00', info: '有' }, { book_time: '2018-06-16 00:00:00', info: '有' }, { book_time: '2018-06-17 00:00:00', info: '有' }] },
        week_arr: '',
        cur_mon_str: ''
    },
    onLoad: function () {

        // 定义变量
        var today = new Date().getDay(),
            current_month = this.data.week.data[0].book_time.substring(5, 7),
            next_month = this.data.week.data.pop().book_time.substring(5, 7),
            week_new = this.data.week.data,
            empty_arr = [],
            week_arr = [],
            cur_mon_str = '';

        if ((Number(next_month) - Number(current_month)) == 0) {
            cur_mon_str = current_month + '月';
        } else if ((Number(next_month) - Number(current_month)) == 1) {
            cur_mon_str = current_month +'、'+ next_month + '月';
        } else {
            cur_mon_str = current_month +'、'+ (Number(current_month) + 1) + '、' + next_month + '月';
        }

        // 将今日之前不可选择的日期存入数组empty_arr中
        for (var i = 1; i < today + 1; i++) {
            empty_arr.push({
                book_time: '',
                show_time: '',
                info: ''
            })
        }

        // 处理后台返回的数据
        week_new.forEach(function (item, index) {

            week_arr.push({
                book_time: item.book_time.substring(0, 10),
                show_time: item.book_time.substring(8, 10),
                info: item.info
            })
        })

        // 更新后台返回的数据
        this.setData({
            week_arr: empty_arr.concat(week_arr),
            cur_mon_str: cur_mon_str
        })

        console.log(this.data.week_arr)
    },

    // radio的单选事件，获取选中的值
    radioChange: function (e) {
        console.log(e);
    }
})