/** 
 * 
 * Redis GEO 功能使用场景
 * https://www.dazhuanlan.com/2020/02/05/5e3a0a3110649/
*/

import * as Redis from "ioredis";

const redis = new Redis();

(async function(){
    const key = 'geo:zhubo';

    // 1. geoadd 添加 ABC三元素&对应的经纬度
    // @ts-ignore
    await redis.geoadd(key, [116.48, 39.9, 'A', 116.9, 39.95, 'B', 116.83, 39.01, 'C']);
    // @ts-ignore
    const dist = await redis.geodist(key, 'A', 'B', 'km');
    console.log(`AB之间的距离为${dist}km`);
    // @ts-ignore
    const pos = await redis.geopos(key, 'A');
    console.log(`A的经纬度为${pos}`);
    // @ts-ignore
    const hash = await redis.geohash(key, 'A');
    console.log(`A的hash为${hash}`);
    // @ts-ignore
    const GEORADIUSBYMEMBER = await redis.georadiusbymember(key, 'A', 300, 'km', 'COUNT', 4, 'asc')
    // @ts-ignore
    const GEORADIUSBYMEMBER1 = await redis.georadiusbymember(key, 'A', 300, 'km', 'withcoord', 'withdist',  'withhash', 'COUNT', 4, 'asc')
    console.log(`A的附近300km, 距离由近到远为${GEORADIUSBYMEMBER}`);
    console.log(`A的附近300km, 距离由近到远为${GEORADIUSBYMEMBER1}`);
    // @ts-ignore
    const GEORADIUS = await redis.georadius(key, 116.67, 39.5, 50, 'km', 'withdist', 'count', 3, 'asc');
    console.log(`距离「116.67, 39.5」附近「50」km内, 距离由近到远前3位为${GEORADIUS}`);
    process.exit(1);
})()




/** 
*!GEOADD: 添加位置 hset结构 
127.0.0.1:6379> GEOADD zhubo 116.48 39.9 A
(integer) 1
127.0.0.1:6379> GEOADD zhubo 116.9 39.95 B
(integer) 1
127.0.0.1:6379> GEOADD zhubo 116.83 39.01 C
(integer) 1
127.0.0.1:6379> GEOADD zhubo 116.67 39.44 D
(integer) 1
*! GEODIST 两个key 之间的距离 km m 
127.0.0.1:6379> GEODIST zhubo A B  km
"36.2543"
127.0.0.1:6379> GEODIST zhubo A A  km
"0.0000"
*! GEOPOS 输出某个key的信息
127.0.0.1:6379> GEOPOS zhubo A
1) 1) "116.47999852895736694"
   2) "39.90000009167092543"
127.0.0.1:6379> GEOPOS zhubo A B
1) 1) "116.47999852895736694"
   2) "39.90000009167092543"
2) 1) "116.90000027418136597"
   2) "39.9500000012600438"
*! GEOHASH 输出对应的hash值
127.0.0.1:6379> GEOHASH zhubo A
1) "wx4ffxd4ke0"

* !GEORADIUSBYMEMBER 距离某个key xxkm，限制number个元素 生序排列
127.0.0.1:6379> GEORADIUSBYMEMBER zhubo A 300 km count 4 asc
1) "A"
2) "B"
3) "D"
4) "C"
127.0.0.1:6379> GEORADIUSBYMEMBER zhubo A 300 km count 4 desc
1) "C"
2) "D"
3) "B"
4) "A"
* !GEORADIUSBYMEMBER 附加 withcoord withdist withhash
127.0.0.1:6379> GEORADIUSBYMEMBER zhubo A 300 km withcoord withdist withhash count 4 asc
1) 1) "A"
   2) "0.0000"
   3) (integer) 4069885894809634
   4) 1) "116.47999852895736694"
      2) "39.90000009167092543"
2) 1) "B"
   2) "36.2543"
   3) (integer) 4069982235196126
   4) 1) "116.90000027418136597"
      2) "39.9500000012600438"
3) 1) "D"
   2) "53.6879"
   3) (integer) 4069136689844544
   4) 1) "116.67000085115432739"
      2) "39.43999889567408701"
4) 1) "C"
   2) "103.4539"
   3) (integer) 4069174206137433
   4) 1) "116.82999998331069946"
      2) "39.01000119404034905"
* !GEORADIUS 距离某个点，附近信息
127.0.0.1:6379> GEORADIUS zhubo 116.67 39.5 50 km withdist count 3 asc
1) 1) "D"
   2) "6.6737"
2) 1) "A"
   2) "47.3686"
*/