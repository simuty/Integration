/*
 * @Author: simuty
 * @Date: 2020-11-18 16:03:18
 * @LastEditTime: 2020-11-18 17:25:55
 * @LastEditors: Please set LastEditors
 * @Description: 
 */

// 总共6天，第五天没有签到

// 二进制转十进制
const a = parseInt('1', 2);
const b = parseInt('11', 2);
const c = parseInt('111', 2);
const d = parseInt('1111', 2);
const e = parseInt('11111', 2);
const f = parseInt('111110', 2);
const g = parseInt('1111101', 2);

console.log(a, b, c, d, e, f, g);
// 1 3 7 15 31 62 125

// number 左移动一位 右移动一位，
// !如果全是1的，肯定不想等
// !如果低位是0的, 左右移动一位，value不变
const aa = a >> 1 << 1;
const bb = b >> 1 << 1;
const cc = c >> 1 << 1;
const dd = d >> 1 << 1;
const ee = e >> 1 << 1;
const ff = f >> 1 << 1;
const gg = g >> 1 << 1;

console.log(aa, bb, cc, dd, ee, ff, gg);
// 0 2 6 14 30 62 124

// 对比数据可以得出：第一次出现相等的数据是 【62 <=> 111110】====> 该用户连续存在五个1

const xBit = '111110110000001111110';
let xValue = parseInt(xBit, 2);
let i = 0;
let signCount = 0;
// 存连续的次数
const score: any = [];
while (i < xBit.length) {
    // 不相等就是签到了
    console.log(xValue.toString(2));
    console.log(xValue);
    if(xValue >> 1 << 1 == xValue) {
        if(i > 0 && signCount > 0) {
            score.push({signCount, i});
            signCount = 0;
            // break;
        }
    } else {
        signCount++;
    }
    xValue >>= 1;
    i++;
}


console.log(`连续签到次数：${signCount}`);
console.log(`连续：`, JSON.stringify(score));


console.log(`总长：${xBit.length}`);
console.log(`二进制转为十进制为：${xValue}`);

