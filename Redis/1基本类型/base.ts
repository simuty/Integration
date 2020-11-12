/*
 * @Author: simuty
 * @Date: 2020-11-12 13:45:29
 * @LastEditTime: 2020-11-12 15:52:23
 * @LastEditors: Please set LastEditors
 * @Description:
 */

import * as Redis from "ioredis";
const redis = new Redis();

(async function base() {
    // await stringFun();
    // await hashFun();
    // await listFun();
    // await setFun();
})()



// string
async function stringFun() {
    const [key1, key2, key3, key4, key5] = ["key1", "key2", "key3", "key4", "key5"];
    const [v1, v2, v3, v4, v5] = ["v1", "v2", "v3", "v4", "v5"];
    // 1. set get
    await redis.set(key1, v1);
    // 2. 过期时间
    await redis.setex(key2, 10, v2);
    // 3. 自增
    await redis.incr(key3);
    // 4. 加减
    await redis.incrby(key3, 100);
    // 5. 是否存在
    const judgeKey4 = await redis.exists(key4);
    // 6. value length
    const keyLen = await redis.strlen(key1);

    const getValue = await redis.get(key1);
    const hgetVaule = await redis.mget(key1, key2, key3);
    console.log("getValue : ", getValue);
    console.log("hgetVaule : ", hgetVaule);
    console.log("judgeKey4 : ", judgeKey4);

    // 6. 删除
    await redis.del(key1, key2, key3, key4);
    process.exit(1);
};

/**
 * Hash
 * 应用场景：
 * 1. 【存-取-改】用户信息【ID、name、age..】，无需set\get string 序列化。
 * 2. 初始化，缓存用户信息
 * 3. 购物车，用户ID：物品ID、数量增减、删除
 * 4. 商品的价格、销量、关注数、评价数等可能经常发生变化的属性，就适合存储在hash类型里
 */
async function hashFun() {
    const userObj = { id: 1, name: 'zhangsan', age: 18 }
    const userKey = 'user_1';
    // 1. hset key filed value
    await redis.hset(userKey, userObj);
    // 2. 所有的key
    const hkeys = await redis.hkeys(userKey);
    // 3. 整个value
    const hgetall = await redis.hgetall(userKey);
    console.log('hkeys: ', hkeys)
    console.log('hgetall: ', hgetall)
    // 4. 更改单个数值
    await redis.hset(userKey, 'age', 100);
    // 5. 字段加减
    await redis.hincrby(userKey, 'age', -90);
    const hgetall1 = await redis.hgetall(userKey);
    console.log('hgetall--: ', hgetall1)
    // 6. hsetnx 如果存在key，则不更新
    await redis.hsetnx(userKey, 'name', 'lisi');
    // !7. expire 设置过期时间
    await redis.expire(userKey, 2);
    process.exit(1);
    /** 
    
    % ts-node base.ts
    hkeys:  [ 'id', 'name', 'age' ]
    hgetall:  { id: '1', name: 'zhangsan', age: '18' }
    hgetall--:  { id: '1', name: 'zhangsan', age: '10' }
    
    */
}

/**
 * 列表
 * 1. list类型是用来存储多个【有序】的字符串的，支持存储【2^32次方-1】个元素。
 * 2. 应用场景
 *      1. 栈： lpush + lpop
 *      2. 队列：lpush + rpop
 *      3. 定长队列：lpush + ltrim
 *      4. 消息队列：lpush + brpop
 */
async function listFun(){
    const bookKey = 'books';
    const bookValue = ['C', 'C++', 'Java', 'OC', 'Node'];
    // 1. 栈【左进左出】
    // C->Node 左：进入队列。
    await redis.lpush(bookKey, bookValue);
    const llen = await redis.llen(bookKey);
    let i = 0;
    while(i < llen) {
        // 左出
        const item = await redis.lpop(bookKey);
        console.log('出栈：', item);
        i++;
    }
    console.log('------');
    // 2. 左进右出
    await redis.lpush(bookKey, bookValue);
    const len = await redis.llen(bookKey);
    let index = 0;
    while(index < len) {
        // 左出
        const item = await redis.rpop(bookKey);
        console.log('出队列-：', item);
        index++;
    }
    console.log('------');    
    /** 
     * 3. 固定长度的队列
     *      1. 队列结合 ltrim,  【保留起止位置内，删除其他】:start_index和end_index定义了一个区间内的值将被保留下来
    */
    await redis.lpush(bookKey, bookValue);
    // 保留【前三个】
    await redis.ltrim(bookKey, 0, 2);
    // 获取【队列全部信息】
    const firstThree = await redis.lrange(bookKey, 0, -1);
    console.log('队列全部信息', firstThree);
    process.exit(1);
}



/**
 * 集合
 * 1. 定义： 集合类型 (Set) 是一个【无序】并【唯一】的键值集合。
 * 2. 场景
 *      1. 关注的人，去重
 *      2. 中奖人
 */
async function setFun() {

}