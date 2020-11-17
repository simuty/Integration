/*
 * @Author: simuty
 * @Date: 2020-11-16 13:49:56
 * @LastEditTime: 2020-11-17 10:39:57
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 公用方法
 */



export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time*1000));
}
