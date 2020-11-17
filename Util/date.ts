/*
 * @Author: simuty
 * @Date: 2020-11-17 10:06:01
 * @LastEditTime: 2020-11-17 16:19:51
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
export function getMonthStartEnd(date?: string): { start: string, end: string } {
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
    console.log(start, end);
    const number = end.diff(start, 'd') + 1;
    return number;
}

/**
 * 返回 某月总的天数
 * 
 * @param date 
 */
export function daysInMonth(date?: string): number {
    const month = date ? moment(date) : moment();
    return moment(month, "YYYY-MM").daysInMonth()
}

// console.log(getYesterday());
// console.log(getLast7Days());
// console.log(getLast30Days());
// console.log(getLastDays(7));
