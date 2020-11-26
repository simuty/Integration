/*
 * @Author: simuty
 * @Date: 2020-11-20 10:31:23
 * @LastEditTime: 2020-11-23 14:59:34
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 
 * 1. 滑动时间实现限流
 */


import * as Redis from "ioredis";
import * as UtilDate from '../../Util/date';
import * as UtilCommon from '../../Util/common';
const redis = new Redis();


/**
 * 滑动时间限流
 * @param key redis 标示
 * @param period 限流时间范围 单位：秒
 * @param limit 最大运行访问次数
 * 1. 非原子性
 * 2. 允许 60s 的最大访问次数为 1000w 的时候，此时如果使用 ZSet 的方式就会占用大量的空间用来存储请求的记录信息
 * 3. 第一秒达到了最大访问次数，之后就一直拒绝
 */
async function isPeriodLimiting(key: string, period: number, limit: number) {
    const unixMS = UtilDate.formatUnix({ type: "MS" });
    // console.log(`清除 0 - ${unixS - period} ----`, unixS);
    // 从目前时间戳开始，清除过去区间的数据【 N 秒】
    // !单位要一致，都是秒
    await redis.zremrangebyscore(key, 0, (unixMS - period * 1000));
    // key对应的总个数
    const currentCount = await redis.zcard(key);
    // console.log('currentCount: ', currentCount)
    // 如果该区间内标记的个数 大于 限制个数，则返回false
    if (currentCount >= limit) {
        return false;
    }
    // 否则，正常写入zset; key score field
    // !field 不能一样
    await redis.zadd(key, unixMS, unixMS);
    return true;
}

(async function () {

    let i = 0;
    // 针对某个接口进行限流
    const key = 'limit:period:buy';
    // 区间限制次数 20
    const limit = 5;
    // 滑动时间区间为 2s
    const period = 2;
    while (i < 20) {
        const noLimit = await isPeriodLimiting(key, period, limit);
        if (noLimit) {
            console.log('正常请求：', i);
        } else {
            console.log('被限制：', i);
            // 如果被限制，等待 区间 时间后，再次判断
            await UtilCommon.sleep(period);
        }
        i++;
    }
    await UtilCommon.sleep(1);
    process.exit(1);
})()


/** 
➜  3限流 git:(main) ✗ ts-node periodLimit.ts
正常请求： 0
正常请求： 1
正常请求： 2
正常请求： 3
正常请求： 4
被限制： 5
正常请求： 6
正常请求： 7
正常请求： 8
正常请求： 9
正常请求： 10
被限制： 11
正常请求： 12
正常请求： 13
正常请求： 14
正常请求： 15
正常请求： 16
被限制： 17
正常请求： 18
正常请求： 19
*/

