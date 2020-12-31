/*
 * @Author: simuty
 * @Date: 2020-12-29 14:13:52
 * @LastEditTime: 2020-12-29 15:13:43
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * 公平洗牌算法--Knuth-Shuffle
 * 用途:
 * 1. 随机打乱数组
 * 2. 
 */

function shuffle(arr: any[]) {
    let n = arr.length, random;
    while (0 !== n) {
        random = (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
        [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
    }
    return arr;
}

