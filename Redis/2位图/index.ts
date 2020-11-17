/*
 * @Author: simuty
 * @Date: 2020-11-13 15:56:42
 * @LastEditTime: 2020-11-17 14:06:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 
 * 1. ioredis 对bit操作支持不友好, tsindex没有对应的type,但是也可以用
 * 2. redis 对promise支持不友好【this is coming in v4】，但是对bit操作支持好
 * 3. 本实例采用node-redis操作
 * 
 * 适用场景：
 * 1. 位图适合存bool数据，当某个业务只有两种结果的时候，位图是不二之选
 * 2. 比如：打卡
 */


import * as redis from "redis";
import { sleep } from "../../Util/common";

const client = redis.createClient();

// (async function base() {
//     // ! FLUSHDB 请空db
//     // await baseBitFun();
//     // await signFun();
//     await sleep(3);
//     process.exit(1);
// })()



// bit 基本操作
async function baseBitFun() {

    // hello => 二进制  【01101000 01100101 01101100 01101100 01101111】
    const [bitKey, bitValue] = ['bitKey', 'hello']
    client.set(bitKey, bitValue, redis.print);
    client.get(bitKey, redis.print);
    // 1. 根据偏移量获取bit上的值 0=》0；1-》1
    client.getbit(bitKey, 1, redis.print);
    // 2. bitcount 获取全部的 1 的总数
    client.bitcount(bitKey, redis.print);
    // 3. setbit 设置指定偏移量的值，0 || 1
    // !offset 参数必须0到 2^32 (bit 映射被限制在 512 MB 之内)。
    // !注意，这里的star和end不是指bit的下标，而是字节(byte)的下标。比如start为1，则实际对应的bit下标为8（1byte = 8 bit）
    client.setbit(bitKey, 0, '1');
    client.bitcount(bitKey, redis.print);
    await sleep(0.2);
    console.log('----获取位置----');
    // 4. 获取第一次出现0或1的位置，获取某个偏移量之后第一次出现0或1的位置
    client.bitpos(bitKey, 0, redis.print)
    client.bitpos(bitKey, 1, redis.print)
    // 1=>8 2=>16 == [8, 16]
    client.bitpos(bitKey, 1, 2, redis.print)
    await sleep(0.2);
    console.log('----BITFIELD----');
    // 设置value=hello
    client.setbit(bitKey, 0, '0');
    client.get(bitKey, redis.print);
    // get i4 0 从0开始取4位即0110,有符号/无符号转十进制为6, 1*2^2+1*2^1 = 6, 结果一致
    const get1Arg = ['get', 'i4', 0];
    // !get i4 4 从4开始取4位即 1000 , 有符号转十进制为 -8, 1000 =>  
    const get2Arg = ['get', 'i4', 4];
    // 5. bitfield
    client.bitfield(bitKey, get1Arg, redis.print);
    client.bitfield(bitKey, get2Arg, redis.print);
    // 6. incrby
    // 2位开始连续4位无符号自增
    const incrby1Arg = ['incrby', 'u4', 2, 1];
    client.bitfield(bitKey, incrby1Arg, redis.print);
    /** 
     * 它用来对指定范围的位进行自增操作。既然提到自增，就有可能出现溢出。如果增加了正数，会出现上溢，如果增加的是负数，就会出现下溢出。
     * 【Redis 默认的处理是折返】。如果出现了溢出，就将溢出的符号位丢掉。如果是 8 位无符号数 255，加 1 后就会溢出，会全部变零。如果是 8 位有符号数 127，加 1 后就会溢出变成 -128。
    */
    await sleep(0.2);
    console.log('----BITOP----');
    /** 
    Reply: OK
    Reply: hello
    Reply: 1
    Reply: 21
    Reply: 22
    ----获取位置----
    Reply: 3
    Reply: 0
    Reply: 17
    ----BITFIELD----
    Reply: hello
    Reply: 6
    Reply: -8
    Reply: 11
    ----BITOP----
    
    */
};




import * as Redis from 'ioredis';
const ioRedis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

const redisDemo = async () => {
    await ioRedis.set('key1', 'foobar');
    await ioRedis.set('key2', 'abcdef');
    // @ts-ignore
    const test = await ioRedis.bitop('and', 'dest', 'key1', 'key2');
    const r = await ioRedis.get('dest');
    const count = await ioRedis.bitcount('dest');
    console.log(r);
    console.log(test);
    console.log(count);
};

redisDemo();