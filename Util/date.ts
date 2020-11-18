/*
 * @Author: simuty
 * @Date: 2020-11-17 10:06:01
 * @LastEditTime: 2020-11-18 18:48:11
 * @LastEditors: Please set LastEditors
 * @Description: 
 */

import * as moment from 'moment';


/**
 * 返回最近七天的开始结束时间
 */
export function getLast7Days(): { start: string, end: string } {
    const start = moment().subtract(7, 'days').format('YYYY-MM-DD')
    const end = moment().subtract(1, 'days').format('YYYY-MM-DD')
    return { start, end }
}
/**
 * 返回 最近30天的开始结束时间
 */
export function getLast30Days(): { start: string, end: string } {
    const start = moment().subtract(30, 'days').format('YYYY-MM-DD')
    const end = moment().subtract(1, 'days').format('YYYY-MM-DD')
    return { start, end }
}
/**
 * 获取 【当前月\某月】的开始结束时间 YYYY-MM-DD
 * @param date 如果存在，返回对应月的起止时间
 */
export function getMonthStartEnd(date?: string | moment.Moment): { start: string, end: string } {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf('month').format('YYYY-MM-DD');
    const end = moment(time).endOf('month').format('YYYY-MM-DD');
    return { start, end }
}

/**
 * 获取 [当前周\某周] 的开始结束时间 YYYY-MM-DD
 * @param date 如果存在，返回对应周的起止时间
 */
export function getWeekStartEnd(date?: string): { start: string, end: string } {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf('week').format('YYYY-MM-DD');
    const end = moment(time).endOf('week').format('YYYY-MM-DD');
    return { start, end }
}

/**
 * 返回过去N天所有的日期 YYYY-MM-DD
 * @param n 
 */
export function getLastDays(n: number) {
    let date = []
    for (let index = 1; index <= n; index++) {
        date.push(moment().subtract(index, 'days').format('YYYY-MM-DD'))
    }
    return date;
}


/**
 * 返回参数在该月是第几天
 * @param date Date string YYYY-MM
 */
export function dayOfNumInMonth(date?: string): number {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf('month');
    const end = moment(time, 'YYYY-MM-DD');
    const number = end.diff(start, 'd') + 1;
    return number;
}


/**
 * 返回某月第index的日期
 * @param index 
 * @param date 
 */
export function withDayOfMonth(index: number, date?: string): string {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf('month');
    const findDate = moment(start.add(index, 'd')).format('YYYY-MM-DD');
    return findDate;
}

/**
 *
 * 返回某个日期 对应月份总天数、天数列表 
 * 
 * @export
 * @param {string} [date] 默认为当前月份
 * @returns {{ days: number, dayList: string[] }} days: 月份的总天数 dayList: [2020-10-01....]
 */
export function daysInMonth(date?: string): { days: number, dayList: string[] } {
    const month = date ? moment(date) : moment();
    const days = moment(month, "YYYY-MM").daysInMonth()
    const { start, end } = getMonthStartEnd(month);
    const dayList: string[] = [];
    let _start = moment(start);
    while (moment(_start).isSameOrBefore(moment(end))) {
        dayList.push(moment(_start).format('YYYY-MM-DD'));
        _start = moment(_start).add(1, 'd');
    }
    return {
        dayList,
        days
    }
}


// console.log(getYesterday());
// console.log(getLast7Days());
// console.log(getLast30Days());
// console.log(getLastDays(7));
