/*
 * @Author: simuty
 * @Date: 2020-11-16 16:06:53
 * @LastEditTime: 2020-11-19 15:06:53
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

enum REDIS_STATIC {
    GET = 'GET',
    SET = 'SET',
    AND = 'and',
    OR = 'OR',
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
            const { days } = DateUtil.daysInMonth(month);
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
                    await this.client.setbit(this.genKey({ date: month, uid }), offset, isSign);
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
                const { days } = DateUtil.daysInMonth(month);
                // allUser 用户ID作为key中的标示
                // 【偏移量+1】就是某月对应的几号
                let offset = 0;
                while (offset < days) {
                    const bit = await this.client.getbit(this.genKey({ date: month, uid }), offset);
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
    public async userSign(uid: number, date: string) {
        const offset = DateUtil.dayOfNumInMonth(date);
        const status = SIGN.YES;
        await this.client.setbit(this.genKey({ date, uid }), offset - 1, status);
        console.log(`用户${uid}在 ${date}签到为${status}`);
    }
    /**
     * 判断用户在某天是否签到
     * @param uid 用户ID
     * @param date YYYY-MM—DD
     */
    public async judgeUserSign(uid: number, date: string) {
        const offset = DateUtil.dayOfNumInMonth(date);
        const status = await this.client.getbit(this.genKey({ date, uid }), offset - 1);
        await this.getAllData(['2020-11']);
        console.log(`用户${uid}在 ${date}签到状态为${status}`);
    }
    /**
     * 用户X在XX月总的签到次数
     * @param uid 用户ID
     * @param date YYYY-MM—DD
     */
    public async getUserSignCount(uid: number, date: string) {
        const count = await this.client.bitcount(this.genKey({ date, uid }));
        console.log(`用户${uid}在 ${date} 月份 签到总次数为${count}`);
    }

    /**
     * 获取当月签到情况
     * 1. 当月最长的签到天数
     * 2. 
     * @param uid 
     * @param date 
     */
    public async getSignInfo(uid: number, date: string) {
        const { days, dayList } = DateUtil.daysInMonth(date);
        const key = this.genKey({ date, uid });
        // days 该月总天数
        const bitValue = await this.genBitIntervalValue({ key, start: 0, length: days });
        if (bitValue === -1) {
            console.log('相关信息不存在')
            return
        }

        let signCount = 0;
        const signInfo = [];
        let signValue = bitValue;
        // 从后往前算
        for (let index = dayList.length; index > 0; index--) {
            // 位运算
            // 先左后右，如果和原数据相等，则标示最低位是0，即，没有签到
            // 从该月最后一天往前算。
            if (signValue >> 1 << 1 === signValue) {
                if (signCount > 0) {
                    // 记录连续的长度&位置
                    signInfo.push({ signCount, index });
                    // 重置连续次数
                    signCount = 0;
                }
            } else {
                signCount++;
            }
            signValue >>= 1;
        }

        // 记录最后的一次连续【高位】
        if (signCount > 0) {
            signInfo.push({ signCount, index: 0 });
        }

        // 统计连续的天数、连续的日期
        const result = [];


        for (const item of signInfo) {
            const { signCount, index } = item;
            const days = [];
            let i = 1;
            let _index = index + 1;
            while (i <= signCount) {
                days.push(_index++);
                i++;
            }
            const arg = {
                signCount,
                days,
            }
            result.push(arg);
        }
        // 排序函数 逆序排列
        const compare = (p: any) => (m: any, n: any) => -(m[p] - n[p]);
        result.sort(compare('signCount'));
        console.log(`------用户${uid}在${date}签到情况-------`)
        console.log("当月签到连续情况为：", '\n', result);
        console.log(`最长的连续签到次数：${result[0].signCount}`);
        console.log(`最长的连续签到次数日期为：${result[0].days}`);
    }

    // 用户在某月第一次签到的日期
    public async getFirstSignDate(uid: number, date: string) {
        // @ts-ignore
        const index = await this.client.bitpos(this.genKey({ date, uid }), SIGN.YES);
        const result: any = index < 0 ? null : DateUtil.withDayOfMonth(Number(index));
        console.log(`用户${uid}在 ${date} 月份 首次签到 日期为${result}`);
    }




    /** -----------------统计近7天连续签到的用户----------------------------- */
    public async signAllWeek() {
        const allUid = [1, 2, 3];
        const [start, length] = [4, 7];
        const { days, dayList } = DateUtil.daysInMonth();
        const tmpList = [];
        // !方法一：为了练习 bitfield SET、tmp value。
        // for (const uid of allUid) {
        //     const key = this.genKey({ uid });
        //     // 统计某7天的bit值
        //     const bitValue = await this.genBitIntervalValue({ key, start, length });
        //     // bitop 是统计 keys 所以 如果摘出来其中的几天，进行bitop 只能临时设置个key
        //     const tmpUidKey = `tmp:uid:bit:${uid}`;
        //     // await this.client.bitfield(tmpUidKey, 300, bitValue);
        //     const type = `u${length}`
        //     // @ts-ignore
        //     await this.client.bitfield(tmpUidKey, REDIS_STATIC.SET, type, 0, bitValue);
        //     tmpList.push(tmpUidKey);
        // }
        // console.log('----------本月某七天-----------')
        // await this.statisticsLastDayAnd(BitMap.SIGN_ALL_WEEK_KEY, tmpList );

        // !方法二，一个判断就够了
        let total = 0;
        for (const uid of allUid) {
            const key = this.genKey({ uid });
            // 统计某7天的bit值
            const bitValue = await this.genBitIntervalValue({ key, start, length });
            bitValue.toString(2) === ''
            const tmpTotal = await this.client.bitcount(bitValue);
            if()
        }
        console.log('----------本月某七天-----------')
        await this.statisticsLastDayAnd(BitMap.SIGN_ALL_WEEK_KEY, tmpList );
    }
    /** -----------------统计近30天连续签到的用户----------------------------- */
    public async signAllMonth() {
        // await this.statisticsLastDayAnd(30, BitMap.SIGN_ALL_MONTH_KEY);
    }
    /** -----------------统计近7天，签到次数 >= 1 的用户----------------------------- */
    public async signInWeek() {
        await this.statisticsLastDayOr(7, BitMap.SIGN_IN_WEEK_KEY);
    }
    /** -----------------统计 指定用户 全年的签到次数总和----------------------------- */
    public async yearSign(uid: number) {
        const year = moment().format('YYYY');
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



    /** -----------------BITOP-AND-OR----------------------------- */
    private async statisticsLastDayAnd(tmpKey: string, bitKeyList: string[]) {
        // @ts-ignore
        await this.client.bitop(REDIS_STATIC.AND, tmpKey, bitKeyList);
        const allCount = await this.client.bitcount(tmpKey);
        console.log(`该时间段内，连续签到的用户数量为: ${allCount}`)

    }

    private async statisticsLastDayOr(number: number, bitKey: string) {
        // @ts-ignore
        const intersection = await this.client.bitop(REDIS_STATIC.OR, bitKey, lastDaysKeys);
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
    private genKey(args: { date?: string, uid: number }) {
        const { date, uid } = args;
        const month = this.genDate(date);
        return `${BitMap.SIGN_PREFIX}${uid}:${month}`;
    }

    // 生成某月的日期
    private genDate(someDay?: string) {
        return someDay ? moment(someDay).format('YYYY-MM') : moment().format('YYYY-MM');
    }

    /**
     * 获取指定区间内的位
     * @param key redis key
     * @param start 开始的位
     * @param length 长度
     * @returns 返回区间内位对应的 十进制数据。
     */
    private async genBitIntervalValue(args: { key: string, start: number, length: number }): Promise<number> {
        const { key, start, length } = args;
        // 无符号 
        const type = `u${length}`;
        // @ts-ignore
        const signList: number[] = await this.client.bitfield(key, REDIS_STATIC.GET, type, start);
        if (signList && signList.length > 0) {
            return signList[0];
        } else {
            return -1;
        }
    }

    private genBinary(length: number) {
        let binary = ''
        for (let index = 0; index < length; index++) {
            binary += '1'
        }
        return binary;
    }


}


(async function () {
    const bitmap = new BitMap();
    // 初始化数据
    await bitmap.initData(['2020-10']);
    // 展示10月份全部签到数据
    await bitmap.getAllData(['2020-10']);

    const [uid1, uid2] = [1, 2]

    // 用户X 签到
    await bitmap.userSign(uid2, '2020-11-18');
    // 用户X在XX日期 是否签到
    await bitmap.judgeUserSign(uid2, '2020-11-18');
    // 用户X在XX月 总的签到次数
    await bitmap.getUserSignCount(uid2, '2020-10');
    // 用户X在XX月 第一次签到的日期
    await bitmap.getFirstSignDate(uid2, '2020-11');
    // 用户XX在XX月 签到的情况
    await bitmap.getSignInfo(uid2, '2020-10');
    // 某个区间内，连续签到的人数总和
    await bitmap.signAllWeek();

    await common.sleep(1);
    process.exit(1);
})()
