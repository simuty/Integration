/*
 * @Author: simuty
 * @Date: 2020-11-12 13:45:29
 * @LastEditTime: 2020-11-13 15:41:14
 * @LastEditors: Please set LastEditors
 * @Description:
 * 参考连接：
 * 1. https://cloud.tencent.com/developer/article/1166307
 */

import * as Redis from "ioredis";
const redis = new Redis();

(async function base() {
    // await stringFun();
    // await hashFun();
    // await listFun();
    // await setFun();
    await zsetFun();
    process.exit(1);
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
};

/**
 * Hash
 * !应用场景：
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
 * !2. 应用场景
 *      1. 栈： lpush + lpop
 *      2. 队列：lpush + rpop
 *      3. 定长队列：lpush + ltrim
 *              1. 场景： 评论列表显示最新100条： 可以设置定长队列100，一直往队列加，获取时如果需要的超出100条，则从DB中搜索；否则直接返回。
 *              2. 【以时间为权重】，先后顺序。
 *      4. 消息队列：lpush + brpop
 */
async function listFun() {
    const bookKey = 'books';
    const bookValue = ['C', 'C++', 'Java', 'OC', 'Node'];
    // 1. 栈【左进左出】
    // C->Node 左：进入队列。
    await redis.lpush(bookKey, bookValue);
    const llen = await redis.llen(bookKey);
    let i = 0;
    while (i < llen) {
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
    while (index < len) {
        // 左出
        const item = await redis.rpop(bookKey);
        console.log('出队列-：', item);
        index++;
    }
    console.log('------');
    /** 
     * 3. 固定长度的队列
     *      1. 队列结合 ltrim,  【保留起止位置内，删除其他】:start_index和end_index定义了一个区间内的值将被保留下来
     * 场景如：评论列表、获取最新资讯相关
    */
    await redis.lpush(bookKey, bookValue);
    // 保留【前三个】
    await redis.ltrim(bookKey, 0, 2);
    // 获取【队列全部信息】
    const firstThree = await redis.lrange(bookKey, 0, -1);
    console.log('队列全部信息', firstThree);
}

/**
 * 集合
 * 1. 定义： 集合类型 (Set) 是一个【无序】并【唯一】的键值集合。
 * !2. 场景：【以某个条件为权重】
 *      1. 关注的人
 *      2. 中奖人
 *      3. 例子
 */
async function setFun() {
    const [key1, key2, key3, key4, key5] = ["set01", "set02", "set03", "set04", "set05"];
    const [v1, v2, v3, v4, v5] = ["v1", "2", "v3", "v4", "v5"];
    const [v10, v20, v30, v40, v50] = ["v1", "v2", "v3", "40", "50"];

    const setV1 = [v1, v2, v3, v4, v5];
    // 1. 添加元素
    await redis.sadd(key1, setV1);
    await redis.sadd(key2, [1, 2, 3, 4, 5]);
    // 2. 获取全部
    const allValue = await redis.smembers(key1);
    // 3. 是否存在
    const sismember = await redis.sismember(key1, 'v1');
    // 4. 随机获取几个数据
    const srandmember = await redis.srandmember(key1, 2);
    // 5. 随机删除几个数据
    await redis.spop(key1, 1);
    console.log('allvalue: ', allValue);
    console.log('sismember: ', sismember);
    console.log('srandmember: ', srandmember);
    const key1Values = await redis.smembers(key1);
    const key2Values = await redis.smembers(key2);
    console.log('key1---Values: ', key1Values);
    console.log('key2---Values: ', key2Values);

    // 6. 将 set1 中的数据 转移到 set2 中: 把set1中的“v1”转移到set2中； 
    await redis.smove(key1, key2, v10);
    // !7. 差集, 以前者为基准
    const sdiff = await redis.sdiff(key1, key2);
    // 8. 交集，
    const sinter = await redis.sinter(key1, key2);
    // 9. 并集
    const sunion = await redis.sunion(key1, key2);
    console.log('sdiff', sdiff)
    console.log('sinter', sinter)
    console.log('sunion', sunion)
    const Vkey1 = await redis.smembers(key1);
    const Vkey2 = await redis.smembers(key2);
    console.log('key1---Values: ', Vkey1);
    console.log('key2---Values: ', Vkey2);

    /** 
allvalue:  [ '2', 'v1', 'v4', 'v5', 'v2', 'v3' ]
sismember:  1
srandmember:  [ '2', 'v3' ]
key1---Values:  [ '2', 'v1', 'v4', 'v5', 'v3' ]
key2---Values:  [ '2', 'v1', '1', '3', '5', '4' ]


sdiff [ 'v5', 'v4', 'v3' ]
sinter [ '2' ]
sunion [ '2', '1', 'v1', '3', 'v4', 'v5', '5', 'v3', '4' ]

key1---Values:  [ '2', 'v4', 'v5', 'v3' ]
key2---Values:  [ '2', 'v1', '1', '3', '5', '4' ]
    */

    // string + set 求交集
    await redis.set("book:1:name", "shujujiegou");
    await redis.set("book:2:name", "suanfa");
    await redis.set("book:3:name", "C");
    // set
    await redis.sadd("tag:jichu", 1);
    await redis.sadd("tag:jichu", 2);
    await redis.sadd("tag:yuyan", 3);
    // 属于【语言】不属于【基础】
    const lang = await redis.sdiff("tag:yuyan", "tag:jichu");
    console.log("lang: ", lang);
    /** 
    lang:  [ '3' ]
    */
}

/**
 * 有序集合
 * 1. 相比于集合类型多了一个排序属性 score（权重），单个存储元素有两个值【元素值、排序值】
 * !2. 场景
 *      1. 游戏排名
 *      2. 微博热点话题
 *      3. 学生成绩：汇总、排名、百分制、
 */
async function zsetFun() {
    const key = "z:student:math";
    const key1 = "z:student:english";
    const key2 = 'z:student:sum';

    const Ykey = "y:student:math";
    // const Ykey1 = "y:student:english";
    // const Ykey2 = 'y:student:sum';
    
    // score field score field ...
    const value = [90, "zhangsan", 20, "lisi", 99, "xiaoming", 60, "xiaohong"];
    const value1 = [30, "zhangsan", 59, "lisi", 80, "xiaoming", 90, "xiaohong"];


    const YmathValue = [30, "lucy", 59, "nick", 80, "davi"];


    // 1. 添加
    await redis.zadd(key, value);
    await redis.zadd(key1, value1);
    // 默认按score生序排列, 0 -1 获取全部的
    const zrange = await redis.zrange(key, 0, -1);
    // !分数由高到低，排 优秀的学生, 得逆序写 【100，80】 反之，顺序排，顺序写数字
    const zrevrange = await redis.zrevrangebyscore(key, 100, 80);
    console.log("zrange", zrange);
    console.log("zrevrange", zrevrange);
    // 2. 删除, 按score区间、起止、
    await redis.zrem(key1, 'xiaming');
    await redis.zrem(key2, 'xiaming');
    // await redis.zremrangebyscore(key, 10, 60);
    // 3. 总个数
    const count = await redis.zcard(key);
    // 4. 区间内个数
    const youxiu = await redis.zcount(key, 80, 100);
    // 5. 获取单个field
    const zhansan = await redis.zscore(key, "zhangsan");
    // 6. 单个fiele 加减
    await redis.zincrby(key, 1, "zhangsan")

    // 7. 多个集合操作
    // ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
    // destination 给定的一个新的集合 
    // numkeys 计算的几个集合
    // WEIGHTS 乘法： 默认算法因子 1
    // AGGREGATE 默认 sum 
    // !总成绩，单科相加
    await redis.zinterstore(key2, 2, key, key1);
    // 全都打印
    const total = await redis.zrange(key2, 0, -1, 'WITHSCORES');
    console.log(total);
    // 8. 某个field排名 从大到小
    const xiaoming = await redis.zrevrank(key, "xiaoming");
    console.log('xiaoming班级排名', xiaoming);

    // !9. 汇总整个年级成绩, 【Y Z 班级数学汇总表】
    // !并集
    await redis.zadd(Ykey, YmathValue);
    // 百分制
    const keyClassMath100 = "clas:math:100";
    const keyClassMath150 = "clas:math:150";
    // 总分
    const keyClassMathTotal = "clas:math:total";
    // 100 分制 返回元素集合的个数
    await redis.zunionstore(keyClassMath100, 2, key1, Ykey);
    // 150 分制度
    await redis.zunionstore(keyClassMath150, 2, key1, Ykey, 'weights', 1.5, 1.5);
    const classMath100 = await redis.zrange(keyClassMath100, 0, -1, 'WITHSCORES');
    const classMath150 = await redis.zrange(keyClassMath150, 0, -1, 'WITHSCORES');
    console.log("年级数学成绩--100分制", classMath100);
    console.log("年级数学成绩--150分制", classMath150);

    // 不知道 AGGREGATE 的用处。。。
    // await redis.zunionstore(keyClassMathTotal, 2, key1, Ykey, 'AGGREGATE', 'max');
    // const classMathTotal = await redis.zrange(keyClassMathTotal, 0, -1, 'WITHSCORES');
    // console.log("年级数学成绩", classMathTotal);

    // 10. 
}