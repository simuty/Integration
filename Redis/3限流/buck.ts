/*
 * @Author: simuty
 * @Date: 2020-11-20 16:50:28
 * @LastEditTime: 2020-11-20 17:28:27
 * @LastEditors: Please set LastEditors
 * @Description: 
 */



const key = `lim:1`
const now = new Date().getTime();
const start = now - 5 * 1000

const max = 100;
const duration = 5

const operations = [
    ['zremrangebyscore', key, 0, start],
    ['zcard', key],
    ['zrange', key, 0, 0],
    ['zrange', key, -max, -max],
    ['pexpire', key, duration]
]
console.log(operations);

operations.splice(2, 0, ['zadd', key, now, now])
console.log(operations);

const toNumber = (str: any) => parseInt(str, 10)


// const res = await this.db.multi(operations).exec()
    const count = toNumber(res[1][1])
    const oldest = toNumber(res[decrease ? 3 : 2][1])
    const oldestInRange = toNumber(res[decrease ? 4 : 3][1])
    const resetMicro =
      (Number.isNaN(oldestInRange) ? oldest : oldestInRange) + duration * 1000

    return {
      remaining: count < max ? max - count : 0,
      reset: Math.floor(resetMicro / 1000000),
      total: max
    }