/*
 * @Author: simuty
 * @Date: 2020-11-20 16:31:29
 * @LastEditTime: 2020-11-25 14:11:01
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 
 * 参考
 * 
 * https://zhuanlan.zhihu.com/p/111354065
 * https://cloud.tencent.com/developer/article/1549910
 * 
 */

import * as Redis from 'ioredis';
import { sleep } from '../../Util/common';
import * as uuid from "uuid";

class DistributedLock {
    redis: Redis.Redis;
    private static LOCK_SUCCESS = "OK";
    // 释放锁成功标志
    private static RELEASE_SUCCESS: number = 1;
    lockLeaseTime: number;
    lockTimeout: number;

    expiryMode: any;

    setMode: any;

    /**
     * 
     * @param client redis 
     * @param options 
     */
    constructor(client: any, options: any = {}) {
        if (!client) {
            throw new Error('client 不存在');
        }
        if (client.status !== 'connecting') {
            throw new Error('client 未正常链接');
        }
        this.redis = client;
        this.lockLeaseTime = options.lockLeaseTime || 2; // 默认锁过期时间 2 秒
        this.lockTimeout = options.lockTimeout || 5; // 默认锁超时时间 5 秒
        // 过期时间 EX: 秒  PX： 毫秒 milliseconds ： 将键的过期时间设置为 milliseconds 毫秒。 执行 SET key value PX milliseconds 的效果等同于执行 PSETEX key milliseconds value 
        this.expiryMode = options.expiryMode || 'EX';
        // NX ： 只在键不存在时， 才对键进行设置操作。 执行 SET key value NX 的效果等同于执行 SETNX key value 
        this.setMode = options.setMode || 'NX';
    }

    /**
     * 上锁🔒
     * @param lockName 锁名字
     * @param randomVale 随机值
     * @param expireTime 过期时间，单位秒
     * !保证上锁的安全--一条命令保证安全性
     * 
     * 1. 如果key不存在，则设置key-value, 且value的唯一性，保证删除的时候同样可以校验
     * 2. 如果key存在，NX 保证不做任何操作
     */
    public async lock(lockName: string, randomVale: string, expire: number) {

        const start = Date.now();
        const self = this;

        return (async function intranetLock(this: any): Promise<any> {
            try {
                const result = await self.redis.set(lockName, randomVale, self.expiryMode, expire | self.lockLeaseTime, self.setMode);
                // 上锁成功
                if (result === 'OK') {
                    console.log(`${lockName} ${randomVale} 上锁成功`);
                    return true;
                }
                // 锁超时
                if (Math.floor((Date.now() - start) / 1000) > self.lockTimeout) {
                    console.log(`${lockName} ${randomVale} 上锁重试超时结束`);
                    return false;
                }
                // 循环等待重试
                console.log(`${lockName} ${randomVale} 等待重试`);
                await sleep(3);
                console.log(`${lockName} ${randomVale} 开始重试`);
                return intranetLock();
            } catch (err) {
                throw new Error(err);
            }
        })();

    }


    /**
     * 解锁
     */
    public async unLock(lockName: string, randomValue: string) {
        try {
            // Watch 命令监控锁。监控锁对应的 key(lockName)，事务开启后，如果其它的客户端对这个 Key 进行了更改，
            // 那么本次事务会被取消而不会执行 redis.watch(lockName)。
            await this.redis.watch(lockName);
            const value = await this.redis.get(lockName);
            // 如果获取到🔒对应的值，与 randomValue 相等
            if (randomValue === value) {
                // 开启事务，删除锁🔒
                const result = await this.redis.multi().del(lockName).exec();
                if (DistributedLock.RELEASE_SUCCESS === result.length) {
                    console.log('解锁成功');
                    return true;
                }
            } else {
                console.log('value 不相等，解锁失败');
            }
        } catch (error) {
            console.log('解锁error', error);

        }
    }
}




async function test(key: string) {


    const redis = new Redis();
    const redisLock = new DistributedLock(redis);
    const lockName = key;
    const randomVale = uuid.v1();
    try {
        // 争抢🔒
        await redisLock.lock(lockName, randomVale, 20);
        await sleep(3);
        const unLock = await redisLock.unLock(lockName, randomVale);
        console.log('unLock: ', lockName, randomVale, unLock);
    } catch (error) {
        console.log('上锁失败', error);
    }

    await sleep(10);
    process.exit(1);

}

test('name1')
test('name1')


/**

➜  5锁 git:(main) ✗ ts-node index.ts
name1 b9ccabe0-2ec7-11eb-b965-933ad584a1de 上锁成功
name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de 等待重试
name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de 开始重试
name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de 等待重试
解锁成功
unLock:  name1 b9ccabe0-2ec7-11eb-b965-933ad584a1de true
name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de 开始重试
name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de 上锁成功
解锁成功
unLock:  name1 b9cdbd50-2ec7-11eb-b965-933ad584a1de true
*/