var app = getApp();
var utils = require('../../utils/util.js');

Page({
    data: {
        selectPeriodIndex: 0,// 选择时间段的索引下标
        num: 0,
        srcReduce: '/images/icon_cut-down.png',
        srcIncrease: '/images/icon_add-to-active.png',
        results: '', // onLoad页面加载时返回立即预订各个列表的数据
        selectPeriodArr: ['上午', '下午', '全天'],
        pleaseSelect: '',
        checkboxChecked: [],
        showModalStatus: false,
        show_textarea: true,// 默认显示多行输入框
        has_no_elder_persons: false,// 是否有老人选项：默认未选中，false
        has_no_child_persons: false,// 是否有儿童选项：默认未选中，false
        numChange: [{ id: 0, gender: '男', num: 0, srcReduce: '/images/icon_cut-down.png', srcIncrease: '/images/icon_add-to-active.png' }, { id: 1, gender: '女', num: 0, srcReduce: '/images/icon_cut-down.png', srcIncrease: '/images/icon_add-to-active.png' }],
        showCalendar: true,// 点击预订日期时显示日历组件
        params: {},// 存储从权益详情页面传递过来的参数
        results_calendar: [],// 点击预订日期时，显示日历组件，存储后台返回的可用资源的数据
        resultsPeriod: [],// 全天的数据
        book_num: '',// 设置中用户输入的预订数量
        week_arr: '',// 日历
        cur_mon_str: '',
        book_date: '',//预订的日历
        AM_PM_arr: ['上午', '下午'],// 领用类的领用时间选择：上午或者下午
        receive_time: 0,// 领用类选择上午下午的下标索引
        results_ground: '',// 场地类： 场地类返回的数据
        period_index: 0,// 场地类：包间的默认显示的下标的数据
        ground_period_arr: [],// 预订时间的数据
        ground_room_show: true,// 选择包间，默认隐藏
        ground_room_arr: [],// 场地类：选择包间的数据
        room_name: '',// 场地类：选择的房间后将数据填充到页面
        room_arr: [],// 场地类：获取多选框选中的值
        door_id: '',// 场地类选择包间的door_id
        room_num: '',// 场地类选择包间的数据
        dinner_results: '',// 用餐类：请求成功后后台返回的数据
        dinner_period_arr: [],// 用餐类：用餐时间的picker数组
        dinner_period_index: 0,// 用餐类：用餐时间索引
        dinner_type_arr: [],// 用餐类：餐型
        dinner_type_index: 0,// 用餐类：选择餐型时的下标索引
        dinner_desk_arr: [],// 用餐类：选择桌型时的数组
        dinner_desk_index: 0,// 用餐类：选择桌型时的数组索引下标
        dinner_door_id: '',// dinner_door_id
        acfs: [],// 用餐类：忌口
        dinner_period: '',// 用餐类： 用餐时间
        ds_setting_id: '',// 用餐类： ds_setting_id
    },

    // onLoad页面加载时
    onLoad: function (options) {
        console.log('onLoad:');
        console.log(options);
        var that = this, cms_code = wx.getStorageSync('cmsCode'),
            params = {
                book_id: options.book_id,
                card_type_id: options.card_type_id,
                cp_id: options.cp_id,
                mrd_id: options.mrd_id,
                srnc_id: options.srnc_id,
                order_category: options.order_category,
                cms_code: cms_code
            };

        this.setData({
            params: params
        });

        app.request(app.api.bookNowUrl, params, function (res) {
            console.log('立即预订数据请求成功：');
            if (res.code == 1) {
                var results = res.data;
                that.setData({
                    results: results
                })
            }
        })
    },

    // showCalendar 默认隐藏日历。日历可用资源的数据请求
    bookDate: function () {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this,
            cur_date = utils.formatTime(new Date()),
            cur_date_arr = cur_date.substring(0, 10).split('/'),
            params = {};

        this.data.showCalendar = !this.data.showCalendar;
        this.data.show_textarea = !this.data.show_textarea;
        this.setData({
            showCalendar: this.data.showCalendar,
            show_textarea: this.data.show_textarea
        })
        params = {
            cp_id: this.data.params.cp_id,
            srnc_id: this.data.params.srnc_id,
            order_category: this.data.params.order_category,
            cms_code: this.data.params.cms_code,
            year_month: cur_date_arr[0] + '-' + Number(cur_date_arr[1]),
        };

        // 预订日历，请求日历的可用资源数量
        app.request(app.api.getCalendarUrl, params, function (res) {

            if (res.code == 1) {
                var results_calendar = res.data.list;
                that.setData({
                    results_calendar: results_calendar
                })
                that.calendar(results_calendar);
            }
            wx.hideLoading();
        })
    },

    // 日历组件
    calendar(results_calendar) {
        // 定义变量
        var today = new Date().getDay(),
            current_month = results_calendar[0].book_date.substring(5, 7),
            next_month = results_calendar[results_calendar.length - 1].book_date.substring(5, 7),
            week_new = results_calendar,
            empty_arr = [],
            week_arr = [],
            cur_mon_str = '';

        if ((Number(next_month) - Number(current_month)) == 0) {
            cur_mon_str = current_month + '月';
        } else if ((Number(next_month) - Number(current_month)) == 1) {
            cur_mon_str = current_month + '、' + next_month + '月';
        } else {
            cur_mon_str = current_month + '、' + (Number(current_month) + 1) + '、' + next_month + '月';
        }

        // 将今日之前不可选择的日期存入数组empty_arr中
        for (var i = 1; i < today + 1; i++) {
            empty_arr.push({
                book_date: '',
                show_time: '',
                available_info: ''
            })
        }

        // 处理后台返回的数据
        week_new.forEach(function (item, index) {

            week_arr.push({
                book_date: item.book_date.substring(0, 10),
                show_time: Number(item.book_date.substring(8, 10)),
                available_info: item.available_info
            })
        })

        // 更新后台返回的数据
        this.setData({
            week_arr: empty_arr.concat(week_arr),
            cur_mon_str: cur_mon_str
        })
    },

    // 日历获取单选或者多选的值
    bindChange: function (e) {
        this.setData({
            book_date: e.detail.value
        })
    },

    // 日历的取消事件
    cancel: function () {
        this.setData({
            showCalendar: true,
            show_textarea: true,
        })
    },

    // 封装预订时间段的请求方法
    get_period_data(period, callback) {
        var that = this,
            params = {
                cp_id: this.data.params.cp_id,
                book_date: this.data.book_date,
                srnc_id: this.data.params.srnc_id,
                cms_code: this.data.params.cms_code,
                order_category: this.data.params.order_category,
                period: period
            };

        app.request(app.api.getBookPeriodUrl, params, function (res) {
            callback(res)
        })
    },

    // 日历的确定事件
    confirm: function (e) {
        var that = this;
        var resultsPeriod = [];
        var params = {
            card_type_id: this.data.params.card_type_id,
            mrd_id: this.data.params.mrd_id,
            book_date: this.data.book_date,
            cp_id: this.data.params.cp_id,
            srnc_id: this.data.params.srnc_id,
            cms_code: this.data.params.cms_code
        };

        // 游玩类：点击确认后请求上午下午时间段的接口
        if (this.data.results.orderCategory == '2') {
            // console.log(this.data.week_arr);
            // var available_info_arr = [];
            // this.data.week_arr.forEach(function (item, index) {
            //     available_info_arr.push(item.available_info);
            // })

            // 用餐类：获取用餐时间、桌型的数据
            app.request(app.api.getDinnerTimeUrl, params, function (res) {
                console.log('获取用餐时间的数据：');
                console.log(res);
                if (res.code == 1) {
                    if ((res.data.dinnerHouse != '') && (res.data.dinnerPeriod != '')) {
                        var dinner_results = res.data;// 后台返回的用餐时间和桌型的数据
                        var dinner_period_arr = [];// 用于存放后台返回的用餐时间的数组
                        var dinner_desk_arr = [];// 用于存放后台返回的桌型的数组
                        var dinner_door_id = [];
                        var dinner_period = dinner_results.dinnerPeriod[0].dinner_period;

                        dinner_results.dinnerPeriod.forEach(function (item, index) {
                            dinner_period_arr.push(item.period_name);
                        })

                        dinner_results.dinnerHouse.forEach(function (item, index) {
                            if (item.dinner_period == dinner_period) {
                                dinner_desk_arr.push(item.door_name);
                                dinner_door_id.push(item.door_id);
                            }
                        })

                        that.setData({
                            dinner_results: dinner_results,
                            dinner_period_arr: dinner_period_arr,
                            dinner_desk_arr: dinner_desk_arr,
                            dinner_period: dinner_results.dinnerPeriod[0].dinner_period,
                            dinner_door_id: dinner_door_id[0]
                        })

                    }
                }
            })

        } else if (this.data.results.orderCategory == '8') {
            // 场地类：点击确定按钮返回的场地类包间信息的数据
            app.request(app.api.getRoomUrl, params, function (res) {
                console.log('请求成功返回的包间数据：');
                console.log(res);
                if (res.code == 1) {
                    var results_ground = res.data;
                    var groundPeriod = res.data.groundPeriod;
                    var ground_period_arr = [];

                    groundPeriod.forEach(function (item, index) {
                        ground_period_arr.push(item.period_name + ' ' + item.begin_time + '-' + item.end_time)
                    })

                    that.setData({
                        results_ground: results_ground,// 预订时间和包间的数据
                        ground_period_arr: ground_period_arr,// 预订时间的数据
                    })
                }

            })

        } else if (this.data.results.orderCategory == '16') {
            // 游玩类：点击确定按钮，返回的游玩类选择时间段的数据
            this.get_period_data('上午', function (res) {
                if (res.code == 1) {
                    var AM_period = res.data.list;
                    AM_period.forEach(function (item, index) {
                        item.period = '上午';
                    })

                    that.get_period_data('下午', function (res) {
                        if (res.code == 1) {
                            var PM_period = res.data.list;
                            PM_period.forEach(function (item, index) {
                                item.period = '下午';
                            })
                            console.log(AM_period.concat(PM_period))
                            that.setData({
                                resultsPeriod: AM_period.concat(PM_period)
                            })
                        }
                    })
                }
            })
        }

        this.setData({
            showCalendar: true,
            show_textarea: true
        })

    },

    // 选择时间段：上午、中午、晚上
    selectPeriod: function (e) {
        this.setData({
            selectPeriodIndex: e.detail.value
        })
    },

    // 领用时间，选择时间：上午或者下午
    AM_PM_select: function (e) {
        this.setData({
            receive_time: e.detail.value
        })
    },

    // 场地类：选择预订时间
    select_ground_period: function (e) {
        if (this.data.book_date) {
            console.log(e);
            this.setData({
                period_index: e.detail.value
            })
        }
    },

    // 场地类：选择包间
    select_ground_room: function () {
        if (this.data.book_date) {
            var period_val = this.data.results_ground.groundPeriod[this.data.period_index].period_val;
            var ground_room_arr = [];

            this.data.results_ground.groundHouse.forEach(function (item, index) {
                if (item.period_val == period_val) {
                    ground_room_arr.push({
                        door_id: item.door_id,
                        ground_name: item.ground_name,
                        period_name: item.period_name,
                        period_val: item.period_val
                    })
                }
            })

            this.data.ground_room_show = !this.data.ground_room_show;
            this.setData({
                ground_room_show: this.data.ground_room_show,
                ground_room_arr: ground_room_arr
            })
        }
    },

    // 用餐类：用餐时间的dinner_time事件
    dinner_time: function (e) {
        if (this.data.book_date) {
            this.setData({
                dinner_period_index: e.detail.value,
                dinner_period: this.data.dinner_results.dinnerPeriod[e.detail.value].dinner_period
            })
        }
    },

    // 用餐类：餐型的dinner_type事件
    dinner_type: function (e) {
        if (this.data.book_date) {
            var dinner_type_arr = [];

            this.data.results.dinnerStyle.forEach(function (item, index) {
                dinner_type_arr.push(item.dinner_name)
            })

            this.setData({
                dinner_type_index: e.detail.value,
                dinner_type_arr: dinner_type_arr,
                ds_setting_id: this.data.results.dinnerStyle[e.detail.value].ds_setting_id
            })
        }
    },

    // 用餐类：桌型的dinner_desk事件
    dinner_desk: function (e) {
        if (this.data.book_date) {
            var dinner_desk_arr = [];
            var dinner_door_id = [];
            var dinner_period = this.data.dinner_results.dinnerPeriod[this.data.dinner_period_index].dinner_period;

            this.data.dinner_results.dinnerHouse.forEach(function (item, index) {
                if (item.dinner_period == dinner_period) {
                    dinner_desk_arr.push(item.door_name);
                    dinner_door_id.push(item.door_id);
                }
            })

            this.setData({
                dinner_desk_arr: dinner_desk_arr,
                dinner_desk_index: e.detail.value,
                dinner_door_id: dinner_door_id[e.detail.value]
            })

        }
    },

    // 用餐类：忌口
    acfs_checkbox: function (e) {
        this.setData({
            acfs: e.detail.value
        })
    },

    // 场地包间：取消事件
    ground_room_cancel: function () {
        this.setData({
            ground_room_show: true,
            show_textarea: true
        })
    },

    // 场地包间：确定事件
    ground_room_confirm: function () {
        this.setData({
            ground_room_show: true,
            show_textarea: true
        })
    },

    // 场地类包间：获取选中的包间的值
    ground_room_checkbox: function (e) {
        var room_arr = e.detail.value;
        var room_name = [];
        var door_id = [];
        var room_arr_new = room_arr.join().split('*');
        room_arr_new.forEach(function (item, index) {
            if (index % 2 == 0) {
                room_name.push(item);
            } else {
                door_id.push(item);
            }
        })

        this.setData({
            room_arr: room_arr,
            room_name: room_name.join().replace(/,/g, " "),
            room_num: room_arr.length,
            door_id: door_id.join()
        })
    },

    // book_num 获取预订的数量
    bookNum: function (e) {
        var index = e.currentTarget.dataset.index;
        var resultsPeriod = this.data.resultsPeriod;
        resultsPeriod[index].val = e.detail.value;

        this.setData({
            resultsPeriod: resultsPeriod
        })

    },

    // 显示使用人的底部弹出层
    showModal: function () {
        this.setData({
            showModalStatus: true,
            show_textarea: false
        })
    },

    // 隐藏使用人的底部弹出层
    hideModal: function () {
        this.setData({
            showModalStatus: false,
            show_textarea: true
        })
    },

    // 添加使用人多选框
    checkboxChange: function (e) {
        var checkboxChecked = [], str = '';

        checkboxChecked.push(e.detail.value);// 选中项push到数组当中
        str += checkboxChecked;// 数组转换成字符串

        var has_no_elder_persons = str.indexOf('elder_persons') > -1 ? true : false;// 判断是否有老人
        var has_no_child_persons = str.indexOf('child_persons') > -1 ? true : false;// 判断是否有儿童

        this.setData({
            checkboxChecked: checkboxChecked,
            has_no_elder_persons: has_no_elder_persons,
            has_no_child_persons: has_no_child_persons
        })
    },

    // 底部弹出层，用户点击确定
    btnConfirm: function () {
        var has_no_elder_persons = this.data.has_no_elder_persons ? '有' : '无';
        var has_no_child_persons = this.data.has_no_child_persons ? '有' : '无';
        var pleaseSelect = this.data.numChange[0].num + '男' + this.data.numChange[1].num + '女' + ' ' + has_no_elder_persons + '老人' + has_no_child_persons + '儿童';

        if ((this.data.numChange[0].num + this.data.numChange[1].num) == 0) {
            wx.showToast({
                title: '使用人数不能为0',
                icon: 'none',
                duration: 2000
            })
        }

        this.setData({
            pleaseSelect: pleaseSelect,
            showModalStatus: false,
            show_textarea: true
        })
    },

    // formSubmit form表单提交，加入购物车
    formSubmit: function (e) {
        console.log('点击提交');
        console.log(e);
        var that = this,
            arr = [],
            params = {},
            obj = this.data.params,
            elder_persons = this.data.has_no_elder_persons,
            child_persons = this.data.has_no_child_persons,
            resultsPeriod = this.data.resultsPeriod;

        arr.push({
            child_persons: child_persons,
            elder_persons: elder_persons,
            male_persons: that.data.numChange[0].num,
            female_persons: that.data.numChange[1].num
        });

        params = {
            note: e.detail.value.note,
            cp_id: obj.cp_id,
            mrd_id: obj.mrd_id,
            srnc_id: obj.srnc_id,
            cms_code: obj.cms_code,
            card_type_id: obj.card_type_id,
            order_category: obj.order_category,
            begin_date: this.data.book_date,// 开始时间
            end_date: this.data.book_date// 结束时间，除了入住类，其他类别的开始时间和结束时间的值一样
        };

        if (this.data.results.orderCategory == '1') {// 领用类

            // 领用类：params
            arr[0].receive_time = parseInt(this.data.receive_time) + 1;
            arr[0].book_num = this.data.num;
            params.json_time_person = encodeURI(JSON.stringify(arr));

        } else if ((this.data.results.orderCategory == '2') && (this.data.book_date)) {// 用餐类

            // 用餐类：params
            arr[0].book_time = this.data.book_date;
            arr[0].book_num = this.data.num;

            params.json_time_person = encodeURI(JSON.stringify(arr));

            params.dinner_period = this.data.dinner_period;
            params.ds_setting_id = this.data.ds_setting_id;
            params.acfs = this.data.acfs.join();
            params.door_id = this.data.dinner_door_id;

            console.log('用餐类的参数params：');
            console.log(params);

        } else if ((this.data.results.orderCategory == '4') && (this.data.book_date)) {// 入住类
            // 入住类的参数
            var date_arr = this.data.book_date;
            var json_time_person = [];

            date_arr.sort(function (t1, t2) {
                return new Date(t1).getTime() - new Date(t2).getTime()
            })

            // console.log('入住类的日期合并：');
            // console.log(date_arr);
            // date_arr.forEach(function (item, index) {
            //     if (date_arr.length == 1) {
            //         var book_time = date_arr[0];
            //     } else {

            //     }
            // })

            console.log(date_arr);

            date_arr.forEach(function (item, index) {
                json_time_person.push({
                    book_time: item,
                    book_num: that.data.num,
                    child_persons: child_persons,
                    elder_persons: elder_persons,
                    male_persons: that.data.numChange[0].num,
                    female_persons: that.data.numChange[1].num
                })
            })
            delete params.begin_date;
            delete params.end_date;
            params.begin_date = date_arr.join();
            params.end_date = date_arr.join();
            params.json_time_person = encodeURI(JSON.stringify(json_time_person));

        } else if ((this.data.results.orderCategory == '8') && (this.data.results_ground.groundPeriod)) {// 场地类
            // 场地类：params
            delete params.begin_date;
            delete params.end_date;
            arr[0].begin_time = this.data.book_date + ' ' + this.data.results_ground.groundPeriod[this.data.period_index].begin_time;
            arr[0].end_time = this.data.book_date + ' ' + this.data.results_ground.groundPeriod[this.data.period_index].end_time;
            arr[0].book_num = this.data.room_num;
            params.door_id = this.data.door_id;
            params.json_time_person = encodeURI(JSON.stringify(arr));

        } else if (this.data.results.orderCategory == '16') {// 游玩类

            var play_arr = [];
            // 遍历时间段数组，组合提交时的json_time_person参数
            resultsPeriod.forEach(function (item, index) {
                if (item.val) {
                    play_arr.push({
                        book_time: item.book_time,
                        book_num: item.val,
                        child_persons: child_persons,
                        elder_persons: elder_persons,
                        male_persons: that.data.numChange[0].num,
                        female_persons: that.data.numChange[1].num
                    })
                }
            })
            // 游玩类：params
            params.json_time_person = encodeURI(JSON.stringify(play_arr));

        }

        if (((this.data.numChange[0].num + this.data.numChange[1].num) != 0) && (this.data.book_date != '')) {
            app.request(app.api.submitBookUrl, params, function (res) {
                if (res.code == 1) {
                    if (e.detail.target.id == 'addCarts') {
                        wx.navigateTo({
                            url: '/pages/shoppingCart/shoppingCart',
                        })
                    } else {
                        wx.navigateTo({
                            url: '/pages/bookingSubmit/bookingSubmit?srnc_id=' + params.srnc_id + '&cp_id=' + params.cp_id + '&mrd_id=' + params.mrd_id + '&card_type_id=' + params.card_type_id + '&"string"=' + "" + '&status=' + "64",
                        })
                    }
                } else if (res.code == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.message,
                        showCancel: false
                    })
                }
            })
        } else {
            if (this.data.book_date == '') {
                wx.showModal({
                    title: '提示',
                    content: '请选择预订日期！',
                    showCancel: false
                })
            } else if ((this.data.numChange[0].num + this.data.numChange[1].num) == 0) {
                wx.showModal({
                    title: '提示',
                    content: '请添加使用人的人数，男女使用人数总和需大于0，否者将无法成功加入购物车！',
                    showCancel: false
                })
            }
        }
    },

    // 数量，点击增加点击减少
    change_num(e) {
        var num = this.data.num;
        if (e.target.id == 'numAdd' && num > 0) {
            num--;
        }
        if (e.target.id == 'numDown') {
            num++;
        }
        var src = num > 0 ? '/images/icon_cut-down-active.png' : '/images/icon_cut-down.png'
        this.setData({
            num: num,
            srcReduce: src
        })
    },

    // 自增事件
    Increase2: function (e) {
        const index = e.currentTarget.dataset.index;
        let numChange = this.data.numChange;
        let num = numChange[index].num;
        let srcReduce = numChange[index].srcReduce;
        num = num + 1;
        numChange[index].num = num;
        if (num > 0) {
            numChange[index].srcReduce = '/images/icon_cut-down-active.png'
        }
        this.setData({
            numChange: numChange
        });
    },
    // 自减事件
    Reduce2: function (e) {
        const index = e.currentTarget.dataset.index;
        const obj = e.currentTarget.dataset.obj;
        let numChange = this.data.numChange;
        let num = numChange[index].num;
        if (num == 1) {
            numChange[index].srcReduce = '/images/icon_cut-down.png'
        } else if (num <= 0) {
            return false;
        }
        num = num - 1;
        numChange[index].num = num;
        this.setData({
            numChange: numChange
        });
    }
})