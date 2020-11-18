/*
 * @Author: simuty
 * @Date: 2020-11-16 16:06:53
 * @LastEditTime: 2020-11-18 17:39:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 
 * 
 * 1. 签到功能
 * 
 * 1. bitcount统计用户一共签到了多少天
 * 2. bitpos指令查找用户从哪一天开始第一次签到
 * 3. 结合 bitcout & bitpos 可以
 *      1. 确定用户从那天开始签到
 *      2. 总的签到多少次
 */

import * as redis from 'ioredis'
import * as moment from 'moment';
import * as Mock from 'mockjs';
import * as DateUtil from '../../Util/date';
import * as common from '../../Util/common';


// 签到
enum SIGN {
    YES = '1',
    NO = '0'
}

enum BITFIELD {
    GET = 'GET'
}

class BitMap {
    /**
     * 定义签到前缀
     * key格式为 sign:{YYYY-MM-DD}
     */
    private static SIGN_PREFIX = "sign:";

    /**
     * 连续一周签到
     */
    private static SIGN_ALL_WEEK_KEY = "sign:allWeek";

    /**
     * 连续一个月签到
     */
    private static SIGN_ALL_MONTH_KEY = "sign:allMonth";

    /**
     * 一周内有签到过的
     */
    private static SIGN_IN_WEEK_KEY = "sign:inWeek";

    private client: redis.Redis;
    allUser: number;

    constructor() {
        this.client = new redis();
        this.allUser = 6;
    }

    /**
     * 1. 以月为key,记录所有用户是否签到：key: sign:{YYYY-MM}:{uid}
     * 2. 以【天数-1】作为 offset
     * 3. 用户ID不为连续number的情况，可以加一个映射表
     */
    /**
     * 
     * @param totalMonth ['2020-10']
     */
    public async initData(totalMonth: string[]) {
        // 初始化数据--日期
        const Random = Mock.Random;
        let isSign = SIGN.NO;

        // 获取上月份的起止时间
        for (const month of totalMonth) {
            // month对应的天数
            const days = DateUtil.daysInMonth(month);
            // allUser 用户ID作为key中的标示
            for (let uid = 1; uid <= this.allUser; uid++) {
                // 【偏移量+1】就是某月对应的几号
                let offset = 0;
                while (offset < days) {
                    if (uid === 1) {
                        isSign = SIGN.YES
                    } else {
                        isSign = Random.boolean() ? SIGN.YES : SIGN.NO;
                    }
                    const status = isSign === SIGN.YES ? '成功' : '失败';
                    await this.client.setbit(this.genKey(month, uid), offset, isSign);
                    const result = `用户${uid}在${month}中第${offset + 1}天签到${status}`;
                    offset++;
                    // console.log(result);
                }

            }
        }

    }


    /**
     * 获取某些月份总的签到数据
     * @param totalMonth 如: ['2020-10']
     */
    public async getAllData(totalMonth: string[]) {
        for (let uid = 1; uid <= this.allUser; uid++) {
            const total = [];
            // 获取上月份的起止时间
            for (const month of totalMonth) {
                // month对应的天数
                const days = DateUtil.daysInMonth(month);
                // allUser 用户ID作为key中的标示
                // 【偏移量+1】就是某月对应的几号
                let offset = 0;
                while (offset < days) {
                    const bit = await this.client.getbit(this.genKey(month, uid), offset);
                    total.push(bit);
                    offset++;
                }
                const result = `用户${uid}在 ${month}月 签到数据: ${total}`;
                console.log(result);
            }
        }
    }
    /**
     * 用户在某天 签到
     * @param uid 用户ID
     * @param date YYYY-MM—DD
     */
    public async userSign(uid: number, date: string){
        const offset = DateUtil.dayOfNumInMonth(date);
        const status = SIGN.YES;
        await this.client.setbit(this.genKey(date, uid), offset-1,  status);
        console.log(`用户${uid}在${date}签到为${status}`);
    }
    /**
     * 判断用户在某天是否签到
     * @param uid 用户ID
     * @param date YYYY-MM—DD
     */
    public async judgeUserSign(uid: number, date: string){
        const offset = DateUtil.dayOfNumInMonth(date);
        const status = await this.client.getbit(this.genKey(date, uid), offset-1);
        await this.getAllData(['2020-11']);
        console.log(`用户${uid}在${date}签到状态为${status}`);
    }
    /**
     * 用户X在XX月总的签到次数
     * @param uid 用户ID
     * @param date YYYY-MM—DD
     */
    public async getUserSignCount(uid: number, date: string){
        const count = await this.client.bitcount(this.genKey(date, uid));
        console.log(`用户${uid}在 ${date} 月份 签到总次数为${count}`);
    }

    /**
     * 获取当月签到情况
     * @param uid 
     * @param date 
     */
    public async getSignInfo(uid: number, date: string) {
        const days = DateUtil.daysInMonth('2020-10');
        const key = this.genKey(date, uid);
        // 无符号+该月总天数
        const type = `u${days}`;
        // @ts-ignore
        const count = this.client.bitfield(key, BITFIELD.GET, type, '0')
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
        }

    }






    

    // 某天的签到总人数
    // public async todayAllData(someDay?: string) {
    //     const month = this.genDate(someDay);
    //     const count = await this.client.bitcount(this.genKey(month, ));
    //     console.log(`${day}, 签到的用户总数量为: ${count}`);
    // }

    // // 获取【某人\某天】的是否签到
    // public async isSign(id: number, someDay?: string) {
    //     const day = this.genDay(someDay);
    //     const value = await this.client.getbit(this.genKey(day), id);
    //     const result = value === 1 ? "已签到" : "没有签到";
    //     console.log(result);
    // }

    /** -----------------统计近7天连续签到的用户----------------------------- */
    public async signAllWeek() {
        await this.statisticsLastDayAnd(7, BitMap.SIGN_ALL_WEEK_KEY);
    }
    /** -----------------统计近30天连续签到的用户----------------------------- */
    public async signAllMonth() {
        await this.statisticsLastDayAnd(30, BitMap.SIGN_ALL_MONTH_KEY);
    }
    /** -----------------统计近7天，签到次数 >= 1 的用户----------------------------- */
    public async signInWeek() {
        await this.statisticsLastDayOr(7, BitMap.SIGN_IN_WEEK_KEY);
    }
    /** -----------------统计 指定用户 全年的签到次数总和----------------------------- */
    public async yearSign(uid: number) {
        // const year = moment().format('YYYY');
        // const arg = this.genKey(`${year}*`);
        // const keys = await this.client.keys(arg);
        // let count = 0;
        // for (const key of keys) {
        //     if (await this.client.getbit(key, uid)) {
        //         count++
        //     }
        // }
        // console.log(`用户${uid}在${year}年，总的签到次数为${count}`);

    }
    /** -----------------计算用户再某个时间段内，从那天开始签到，总共签到多少次----------------------------- */
    public async calStartDay(uid: number) {
        // @ts-ignore
        await this.client.bitpos(this.genKey('2020-10'), 1);
        // console.log(`用户${uid}在${year}年，总的签到次数为${count}`);

    }

    public async calStartCount(uid: number) {
        // const year = moment().format('YYYY');
        // const arg = this.genKey(`${year}*`);
        // const keys = await this.client.keys(arg);
        // let count = 0;
        // for (const key of keys) {
        //     if (await this.client.getbit(key, uid)) {
        //         count++
        //     }
        // }
        // console.log(`用户${uid}在${year}年，总的签到次数为${count}`);

    }


    /** -----------------BITOP-AND-OR----------------------------- */
    private async statisticsLastDayAnd(number: number, bitKey: string) {
        const lastDaysKeys = this.genLastKeys(number);
        // @ts-ignore
        const intersection = await this.client.bitop('and', bitKey, lastDaysKeys);
        const allCount = await this.client.bitcount(bitKey);
        console.log(`最近${number}天, 连续签到的用户数量为: ${allCount}`)

    }

    private async statisticsLastDayOr(number: number, bitKey: string) {
        const lastDaysKeys = this.genLastKeys(number);
        // @ts-ignore
        const intersection = await this.client.bitop('or', bitKey, lastDaysKeys);
        const allCount = await this.client.bitcount(bitKey);
        console.log(`最近${number}天, 签到次数 >= 1 的用户数量为: ${allCount}`)

    }

    // 生成redis key
    /**
     * redis key
     * key格式为 sign:{YYYY-MM}:uid
     * @param key YYYY-MM-DD
     * @param uid uid
     */
    private genKey(date: string, uid: number) {
        const month = this.genDate(date);
        return `${BitMap.SIGN_PREFIX}${month}:${uid}`;
    }

    // 生成某月的日期
    private genDate(someDay?: string) {
        return someDay ? moment(someDay).format('YYYY-MM') : moment().format('YYYY-MM');
    }

    /**
     * 生成最近 N 天的keys
     * @param number N 天
     */
    private genLastKeys(number: number) {
        const lastDays = DateUtil.getLastDays(number);
        // const lastKeys = [];
        // for (const key of lastDays) {
        //     lastKeys.push(this.genKey(key));
        // }
        // return lastKeys;
    }


}


(async function () {
    const bitmap = new BitMap();
    // 初始化数据
    await bitmap.initData(['2020-10']);
    // 展示10月份全部签到数据
    await bitmap.getAllData(['2020-10']);

    // 用户X签到
    await bitmap.userSign(2, '2020-11-18');
    // 用户X在XX日期是否签到
    await bitmap.judgeUserSign(2, '2020-11-18');
    // 用户X在XX月总的签到次数
    await bitmap.getUserSignCount(2, '2020-10');


    // 某天签到总数量
    // await bitmap.todayAllData();
    // 最近7天
    await bitmap.signAllWeek();
    // 最近30天
    await bitmap.signAllMonth();
    // 最近7天 sign >= 1
    await bitmap.signInWeek();
    // 某人在某年总的签到次数
    await bitmap.yearSign(2);
    // 某人在某月首次签到的日期


    await common.sleep(1);
    process.exit(1);
})()
