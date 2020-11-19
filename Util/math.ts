/*
 * @Author: simuty
 * @Date: 2020-11-19 15:47:14
 * @LastEditTime: 2020-11-19 18:21:24
 * @LastEditors: Please set LastEditors
 * @Description: 
 */


 
/**
 * 判断是否是偶数
 * 说下大致原理：若最后一位二进制为0，那么二进制转成十进制后必然可以写成2n的形式，必为偶数。比如我随便写一个最后一位为0的二进制数字 10001010，那么其十进制数为2+2^3+2^7 = 2*(1+2^2+2^6),故为偶数，大家可以多写几组数字验证。
 * @param value 
 */
export function isOdd(value: number) {
    return (value & 1); // 取出最后一位二进制，若为1则是奇数
}