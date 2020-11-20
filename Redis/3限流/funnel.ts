/*
 * @Author: simuty
 * @Date: 2020-11-20 14:32:32
 * @LastEditTime: 2020-11-20 16:50:17
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 漏斗限流
 * 
 * https://github.com/YigWoo/toys/blob/master/javatoys/src/main/java/com/yigwoo/ratelimiter/v2/LuaRateLimiter.java
 */


class Funnel {
    // 漏斗容量 
    private capacity: number;
    // 漏嘴流水速率 个数/每毫秒 
    private leakRate: number;
    // 漏斗剩余空间
    private leftQuota: number;
    // 上一次漏水时间
    private leakTs: number;
    constructor(capacity: number, leakRate: number) {
        this.capacity = capacity;
        this.leakRate = leakRate;
        this.leftQuota = capacity;
        this.leakTs = this.timestamp();
    }

    public makeSpace() {
        // 当前时间戳
        const nowTs = this.timestamp();
        // 两次漏水时间差
        const deltaTs = this.leakTs - nowTs;
        // 腾出的空间，时间*速率
        const deltaQuota = deltaTs * this.leakRate;
        if (deltaQuota < 1) {
            return
        }
        // 增加剩余空间
        this.leftQuota += deltaQuota;
        // 记录漏水时间
        this.leakTs = nowTs;
        // 剩余空间不得高于容量
        if (this.leftQuota > this.capacity) {
            this.leftQuota = this.capacity;
        }
    }

    public watering(quota: number) {
        this.makeSpace();
        if (this.leftQuota >= quota) {
            this.leftQuota -= quota;
            return true;
        } else {
            return false
        }
    }
    /**
     * 时间戳 -- 毫秒
     */
    private timestamp() {
        return new Date().getTime();
    }

}

const funnelMap: { [arg: string]: Funnel } = {};

/**
 * 是否接受操作
 * @param userId 用户ID
 * @param actionKey 操作动作
 * @param capacity 漏斗的大小
 * @param leakRate 速率 个数/每毫秒
 */
async function isActonAllow(userId: number, actionKey: string, capacity: number, leakRate: number) {
    const key: string = `${userId}:${actionKey}`;
    if (!funnelMap.hasOwnProperty(key)) {
        const item = new Funnel(capacity, leakRate);
        funnelMap[key] = item;
    }
    const funnel = funnelMap[key];
    return funnel.watering(1);

}





(async function isAllow() {
    let i = 0
    while (i < 20) {
        const result = await isActonAllow(1, 'reply', 10, 1)
        console.log('访问权限', result);
        i++;
    }
})()


/** 
 *  redis 利用 hest 实现 漏斗限流
 * https://vv13.cn/Algorithm/20200902_%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E5%9C%A8Node.js%E4%B8%AD%E4%BD%BF%E7%94%A8Redis%E5%81%9A%E8%AF%B7%E6%B1%82%E9%99%90%E6%B5%81/
 * 

// index.js
import { slidingLog } from "./middleware/slidingLog.js";app.use(slidingWindow);
app.use(slidingLog);

// middleware/slidingLog
import Redis from "ioredis";

const DURATION = 60;
const MAX_REQ_IN_DURATION = 100;
const redisClient = new Redis(6379);

export const slidingLog = async (ctx, next) => {
  const redisKey = `ratelimit:${ctx.ip}`;
  const durationEnd = Date.now();
  const durationStart = durationEnd - DURATION * 1000;
  const exists = await redisClient.exists(redisKey);
  if (!exists) {
    await redisClient
      .multi()
      .zadd(redisKey, durationEnd, durationEnd)
      .expire(redisKey, DURATION)
      .exec();
    next();
    return;
  }
  const re = await redisClient
    .multi()
    .zremrangebyscore(redisKey, 0, durationStart)
    .zcard(redisKey)
    .expire(redisKey, DURATION)
    .exec();
  if (re[1][1] < MAX_REQ_IN_DURATION) {
    await redisClient.zadd(redisKey, durationEnd, durationEnd);
    next();
  } else {
    ctx.status = 429;
    ctx.body = "you have too many requests";
  }
};
*/