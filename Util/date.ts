/*
 * @Author: simuty
 * @Date: 2020-11-17 10:06:01
 * @LastEditTime: 2020-12-12 15:49:17
 * @LastEditors: Please set LastEditors
 * @Description:
 */

import * as moment from "moment";

/**
 * 返回最近七天的开始结束时间
 */
export function getLast7Days(): { start: string; end: string } {
    const start = moment().subtract(7, "days").format("YYYY-MM-DD");
    const end = moment().subtract(1, "days").format("YYYY-MM-DD");
    return { start, end };
}
/**
 * 返回 最近30天的开始结束时间
 */
export function getLast30Days(): { start: string; end: string } {
    const start = moment().subtract(30, "days").format("YYYY-MM-DD");
    const end = moment().subtract(1, "days").format("YYYY-MM-DD");
    return { start, end };
}
/**
 * 获取 【当前月\某月】的开始结束时间 YYYY-MM-DD
 * @param date 如果存在，返回对应月的起止时间
 */
export function getMonthStartEnd(
    date?: string | moment.Moment,
): { start: string; end: string } {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf("month").format("YYYY-MM-DD");
    const end = moment(time).endOf("month").format("YYYY-MM-DD");
    return { start, end };
}

/**
 * 获取 [当前周\某周] 的开始结束时间 YYYY-MM-DD
 * @param date 如果存在，返回对应周的起止时间
 */
export function getWeekStartEnd(date?: string): { start: string; end: string } {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf("week").format("YYYY-MM-DD");
    const end = moment(time).endOf("week").format("YYYY-MM-DD");
    return { start, end };
}

/**
 * 返回过去N天所有的日期 YYYY-MM-DD
 * @param n
 */
export function getLastDays(n: number) {
    let date = [];
    for (let index = 1; index <= n; index++) {
        date.push(moment().subtract(index, "days").format("YYYY-MM-DD"));
    }
    return date;
}

/**
 * 返回参数在该月是第几天
 * @param date Date string YYYY-MM
 */
export function dayOfNumInMonth(date?: string): number {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf("month");
    const end = moment(time, "YYYY-MM-DD");
    const number = end.diff(start, "d") + 1;
    return number;
}

/**
 * 返回某月第index的日期
 * @param index
 * @param date
 */
export function withDayOfMonth(index: number, date?: string): string {
    const time = date ? moment(date) : moment();
    const start = moment(time).startOf("month");
    const findDate = moment(start.add(index, "d")).format("YYYY-MM-DD");
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
export function daysInMonth(
    date?: string,
): { days: number; dayList: string[] } {
    const month = date ? moment(date) : moment();
    const days = moment(month, "YYYY-MM").daysInMonth();
    const { start, end } = getMonthStartEnd(month);
    const dayList: string[] = [];
    let _start = moment(start);
    while (moment(_start).isSameOrBefore(moment(end))) {
        dayList.push(moment(_start).format("YYYY-MM-DD"));
        _start = moment(_start).add(1, "d");
    }
    return {
        dayList,
        days,
    };
}

/**
 * 格式化时间
 * @param date 时间
 * @param type 默认 YYYY-MM-DD HH:mm:ss； 非 all 返回YYYY-MM-DD
 */
export function format(date: string | Date, type: string = 'all') {
    if (!isValidDate(date)) {
      moment(date).format(type === 'all' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
    }
  }
  

/**
 * 格式化时间, 如果无效返回当前时间
 * @param date 时间
 * @param type 默认 YYYY-MM-DD HH:mm:ss； 非 all 返回YYYY-MM-DD
 */
export function formatOrCurren(date: string | Date, type: string = 'all') {
    const _date = isValidDate(date) ? date : moment();
    return moment(_date).format(
      type === 'all' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
    );
  }
  
  
/**
 *
 *
 * @param {Date | moment.Moment | string} time
 * @return {number} Unix 时间戳 毫秒
 */
/**
 * 将各种时间转换成unix时间戳 单位 毫秒 或 秒
 * 1.
 * @param args
 */
// 时间戳类型  毫秒 | 秒
type UNIX_TYPE = "MS" | "S";
export function formatUnix(args?: {
    time?: Date | moment.Moment | string;
    type?: UNIX_TYPE;
}) {
    if (!args) {
        return moment().unix();
    }
    const { time = moment(), type = "S" } = args;
    let mt: moment.Moment;
    if (time instanceof Date) {
        mt = moment(time);
    } else if (moment.isMoment(time)) {
        mt = time;
    } else {
        mt = moment(time, "YYYY-MM-DD HH:mm:ss");
    }
    return type === "S" ? mt.unix() : mt.valueOf();
}

// 当天剩余秒数
export function remainSecond() {
    // 计算截止当天晚上23:59:59秒数
    const end = moment().endOf("day");
    const now = moment();
    return end.diff(now, "second");
}


/**
 * 校验是否是有效的日期，
 * true: 有效的日期格式
 * false: 无效的日期
 * @param date 
 */
export function isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
}
