/*
 * @Author: simuty
 * @Date: 2020-11-23 11:25:39
 * @LastEditTime: 2020-11-23 11:31:22
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 * async-ratelimiter 源码
 * 
 * https://github.com/microlinkhq/async-ratelimiter
 */


const assert = require('assert')

const microtime = require('./microtime')

const toNumber = (str: any) => parseInt(str, 10)

export class Limiter {
    db: any
    id: any
    max: any
    duration: any
    namespace: any
    constructor({ id = '', db = '', max = 2500, duration = 3600000, namespace = 'limit' }) {
        assert(db, 'db required')
        this.db = db
        this.id = id
        this.max = max
        this.duration = duration
        this.namespace = namespace
    }

    async get({
        id = this.id,
        max = this.max,
        duration = this.duration,
        decrease = true
    } = {}) {
        assert(id, 'id required')
        assert(max, 'max required')
        assert(duration, 'duration required')

        const key = `${this.namespace}:${id}`
        const now1 = now()
        const start = now1 - duration * 1000

        const operations = [
            ['zremrangebyscore', key, 0, start],
            ['zcard', key],
            ['zrange', key, 0, 0],
            ['zrange', key, -max, -max],
            ['pexpire', key, duration]
        ]

        if (decrease) operations.splice(2, 0, ['zadd', key, now, now])

        const res = await this.db.multi(operations).exec()
        const count = toNumber(res[1][1])
        // 过期区间
        const oldest = toNumber(res[decrease ? 3 : 2][1])
        const oldestInRange = toNumber(res[decrease ? 4 : 3][1])
        const resetMicro =
            (Number.isNaN(oldestInRange) ? oldest : oldestInRange) + duration * 1000

        return {
            remaining: count < max ? max - count : 0,
            reset: Math.floor(resetMicro / 1000000),
            total: max
        }
    }
}



const time = Date.now() * 1e3
const start = process.hrtime()

const now = function () {
  const diff = process.hrtime(start)
  return time + diff[0] * 1e6 + Math.round(diff[1] * 1e-3)
}