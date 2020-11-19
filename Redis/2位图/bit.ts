/*
 * @Author: simuty
 * @Date: 2020-11-18 16:03:18
 * @LastEditTime: 2020-11-19 15:40:18
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * https://juejin.im/post/6844903846947323918#heading-19
 */


/** ---------------------- 模拟签到 -----------------------------  */

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

const xBit = '1111110111000111111111111110';
let xValue = parseInt(xBit, 2);
let i = 0;
let signCount = 0;
// 存连续的次数
const score: any = [];

for (let index = xBit.length; index > 0; index--) {
    // console.log(xValue.toString(2));
    // console.log(xValue);
    // 相等则低位为0
    if (xValue >> 1 << 1 == xValue) {
        if (signCount > 0) {
            // 记录连续的长度&位置
            score.push({ signCount, index });
            // 重置连续次数
            signCount = 0;
        }
    } else {
        // 连续+1
        signCount++;
    }
    // 右移一位
    xValue >>= 1;
}

// 记录最后的一次连续【高位】
if (signCount > 0) {
    score.push({ signCount, index: 0 });
}
// 统计连续的天数、连续的日期
const result = [];


for (const item of score) {
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

console.log("当月签到连续情况为：", result);


console.log(`最长的连续签到次数：${result[0].signCount}`);
console.log(`最长的连续签到次数日期为：${result[0].days}`);


console.log(`总长：${xBit.length}`);
console.log(`二进制转为十进制为：${xValue}`);



