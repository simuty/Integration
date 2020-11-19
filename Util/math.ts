/*
 * @Author: simuty
 * @Date: 2020-11-19 15:47:14
 * @LastEditTime: 2020-11-19 15:47:36
 * @LastEditors: Please set LastEditors
 * @Description: 
 */



export function isOdd(value: number) {
    return (value & 1); // 取出最后一位二进制，若为1则是奇数
}