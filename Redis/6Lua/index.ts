/*
 * @Author: simuty
 * @Date: 2020-11-11 17:18:49
 * @LastEditTime: 2020-11-26 14:05:28
 * @LastEditors: Please set LastEditors
 * @Description: 
 * https://juejin.im/post/6844903990396731405
 */

import * as Redis from 'ioredis';
import { sleep } from '../../Util/common';
import * as fs from "fs";
// import * as limit from './limit.lua';
const redis = new Redis();

// 嵌入脚本
async function fun1() {
    const argv = ['lua-key', 'lua-value'];
    const set = await redis.eval("return redis.call('set', KEYS[1], ARGV[1])", 1, argv);
    const get = await redis.eval("return redis.call('get', KEYS[1])", 1, argv[0]);
    console.log("简单:", set, get);
    // 同时传入多个key需要借助lua中的循环
    // const list = await redis.eval("redis.call('lpush', KEYS[1], ARGV)", 1, 'list', 1,2,3);
    await redis.eval("return redis.call('lpush', KEYS[1], ARGV[1])", 1, 'list', '1');
    const listGet = await redis.eval("return redis.call('lrange', KEYS[1], ARGV[1], ARGV[2])", 1, 'list', 0, -1);
    console.log("队列:", listGet)
}

const evalScript = `return redis.call('SET', KEYS[1], ARGV[2])`;
// 缓存脚本
async function fun2() {
    // 1. 缓存脚本获取 sha1 值
    const sha1 = await redis.script("load", evalScript);
    console.log(sha1); // 6bce4ade07396ba3eb2d98e461167563a868c661
    // 2. 通过 evalsha 执行脚本
    await redis.evalsha(sha1, 2, 'name1', 'name2', 'val1', 'val2');
    // 3. 获取数据
    const result = await redis.get("name1");
    console.log(result); // "val2"
}

/**
 * 脚本文件---频率控制
 * 每十秒只允许访问3次
 */
async function fun3() {
    const luaScript = fs.readFileSync('./limit.lua');
    const key = 'rate:limit';
    let i = 0
    while (i < 5) {
        // @ts-ignore
        const limit = await redis.eval(luaScript, 1, key, 10, 3);
        console.log('limit', limit);
        i++
    }

}

(async function fun() {
    // await fun1()
    // await fun2()
    await fun3()
    await sleep(1);
    process.exit(1)
})()

