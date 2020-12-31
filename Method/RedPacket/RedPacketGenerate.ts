/*
 * @Author: simuty
 * @Date: 2020-12-03 10:58:22
 * @LastEditTime: 2020-12-08 15:45:45
 * @LastEditors: Please set LastEditors
 * @Description:
 *
 * 红包生成算法
 * 1. 二倍均值法
 * 2. 拼手速
 */

/**
 * 1. 二倍均值法
 *
 * !核心：红包 = 随机([最小值，(红包剩余金额 / 人数 * 2)])
 *
 *
 * @param totalAmount 总金额 单位：分
 * @param redPacketNum 总人数
 * @return 小红包值【单位：分】
 *
 * const [amout, redPacketNum] = [0.1, 10];
 * const redList = fairMethod(amout, redPacketNum);
 * const sum = ;
 * console.log("红包生成", redList);
 * console.log("红包总金额【单位：分】：", sum);
 * console.log("红包总份数：", redList?.length);
 *
 */
export function fairMethod(totalAmount: number, redPacketNum: number) {
  // 无效数据
  if (totalAmount < 0 && redPacketNum < 0) throw '金额错误';
  let curTotalAmount = totalAmount;
  if (curTotalAmount / redPacketNum < 1) throw '最低每人0.1元';
  // 最小值 单位：分
  const min = 1;
  // 剩余人数
  let _redPacketNum = redPacketNum;
  // 结果单位
  const reslut: number[] = [];
  while (_redPacketNum > 1) {
    const max = (curTotalAmount / _redPacketNum) * 2;
    // 红包金额
    const amount = randomInt(min, max);
    // 金额-、人数-
    curTotalAmount -= amount;
    _redPacketNum--;
    reslut.push(amount);
  }
  // 最后金额为最后一个红包
  reslut.push(curTotalAmount);
  return reslut;
}

/**
 * 拼手速版本
 * @param totalAmount 总金额； 单位分
 * @param redPacketNum 红包个数
 */
export function speedMethod(totalAmount: number, redPacketNum: number) {
  // 无效数据
  if (totalAmount < 0 && redPacketNum < 0) throw '金额错误';
  const curTotalAmount = totalAmount;
  if (curTotalAmount / redPacketNum < 1) throw '最低每人0.1元';
  let [ begin, end ] = [ 0, curTotalAmount ];
  // 剩余
  let _redPacketNum = redPacketNum;
  // 结果
  const result: number[] = [];
  while (_redPacketNum > 1) {
    // 如果红包发完了，就直接返回0
    if (begin === end) {
      result.push(0);
    } else {
      // 如果 起止间隔1，得特殊补充一下，否则会少1分，《原因在于math.randomInt(99, 100),总是返回99》
      if (end === begin + 1) {
        begin++;
        result.push(1);
      } else {
        // 起止位置中 挑个点
        const randomPoint = randomInt(begin, end);
        // console.log("begin", begin);
        // console.log("end", end);
        // console.log("randomPoint", randomPoint);
        // 亮点之间的距离作为 红包金额
        const amount = randomPoint - begin;
        // 更改起点
        begin += amount;
        result.push(amount);
      }
    }
    _redPacketNum--;
  }
  // 最后一个兜底
  result.push(end - begin);
  return result;
}

/**
 * 随机整数 【含最大值，含最小值】
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * !如果需要设置红包的最大最小值，在这里可以改改
 * @param min min
 * @param max max
 */
function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// !测试
// const [amout, redPacketNum] = [100, 20];
// let i = 0;
// while (i < 5) {
//     i++;
//     const cutLine = speedMethod(amout, redPacketNum);
//     console.log("拼手速红包：", cutLine, '--', cutLine.reduce((p, c)=>p+c), '-', cutLine.length);
// }

// let j = 0;
// while (j < 5) {
//     j++;
//     const cutLine = fairMethod(amout, redPacketNum);
//     console.log("公平红包  ：", cutLine, '--', cutLine.reduce((p, c)=>p+c), '-',cutLine.length);
// }


// !结果
/**
拼手速红包： [ 66, 8, 13, 0, 10, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] -- 100 - 20
拼手速红包： [ 52, 2, 42, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] -- 100 - 20
拼手速红包： [ 50, 0, 45, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] -- 100 - 20
拼手速红包： [ 90, 2, 3, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] -- 100 - 20
拼手速红包： [ 61, 2, 25, 6, 0, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] -- 100 - 20

公平红包  ： [ 6, 7, 2, 7, 4, 1, 7, 1, 6, 1, 9, 4, 10, 6, 8, 3, 8, 5, 1, 4 ] -- 100 - 20
公平红包  ： [ 7, 1, 1, 1, 6, 6, 11, 8, 6, 4, 5, 5, 2, 9, 1, 1, 1, 9, 8, 8 ] -- 100 - 20
公平红包  ： [ 6, 5, 8, 5, 6, 7, 7, 3, 7, 6, 4, 7, 1, 1, 1, 5, 1, 11, 4, 5 ] -- 100 - 20
公平红包  ： [ 4, 7, 4, 8, 7, 5, 4, 8, 8, 1, 7, 2, 2, 6, 3, 4, 3, 3, 2, 12 ] -- 100 - 20
公平红包  ： [ 9, 3, 2, 6, 3, 8, 6, 5, 2, 4, 10, 7, 5, 1, 6, 5, 8, 1, 7, 2 ] -- 100 - 20
*/
