// pages/calendar/calendar.js
Page({
    data: {
        canlender: {
            'month': '',
            'date': '',
            "day": '',
            'year': '',
            "weeks": []
        },
        currentObj: '',
        currentDate: '',
        isMulti: false
    },
    onLoad: function () {
        var currentObj = new Date();
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentDay: currentObj.getDate(),
            currentObj: currentObj
        })
        this.getDate(currentObj);
    },

    // 上一个月和下一个月
    selectMonth: function (e) {
        var currentObj = this.data.currentObj;
        var year = currentObj.getFullYear();
        var month = currentObj.getMonth() + 1;
        var date = currentObj.getDate();
        var str = ''
        if (e.currentTarget.dataset.key == 'left') {
            month -= 1
            if (month <= 0) {
                str = (year - 1) + '/' + 12 + '/' + date
            } else {
                str = year + '/' + month + '/' + date
            }
        } else {
            month += 1
            if (month <= 12) {
                str = year + '/' + month + '/' + date
            } else {
                str = (year + 1) + '/' + 1 + '/' + date
            }
        }
        currentObj = new Date(str)
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentObj: currentObj
        })
        this.getDate(currentObj);
    },

    // 获取日期
    getDate(currentObj) {
        var year = currentObj.getFullYear();
        var month = currentObj.getMonth() + 1;
        var date = currentObj.getDate();
        var canlender = [];
        // 本月第一天的是星期几
        var firstDay = new Date(year, month - 1, 1).getDay();
        var lastMonthDays = [];
        for (var i = firstDay; i > 0; i--) {
            var lastMonthDy = new Date(year, month - 1, -i + 1).getDate() + ''
            lastMonthDays.push({
                'date': lastMonthDy,
                'month': month - 1
            })
        }
        // 当前月的天数
        var currentMonthDys = [], currentMonthDysNum = new Date(year, month, 0).getDate();
        for (var i = 1; i <= currentMonthDysNum; i++) {
            currentMonthDys.push({
                'date': i + "",
                'month': month
            })
        }
        // 本月要显示的下一个月的天数
        var nextMonthDays = []
        var endDay = new Date(year, month, 0).getDay();
        for (var i = 1; i < 7 - endDay; i++) {
            nextMonthDays.push({
                'date': i + '',
                'month': month + 1
            })
        }

        canlender = canlender.concat(lastMonthDays, currentMonthDys, nextMonthDays);

        // 每周要显示的天数
        var weeks = []
        for (var i = 0; i < canlender.length; i++) {
            if (i % 7 == 0) {
                weeks[parseInt(i / 7)] = new Array(7);
            }
            weeks[parseInt(i / 7)][i % 7] = canlender[i]
        }

        this.setData({
            "canlender.weeks": weeks
        })
    }
})