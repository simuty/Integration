/*
 * @Author: simuty
 * @Date: 2020-12-07 10:33:01
 * @LastEditTime: 2020-12-07 10:47:29
 * @LastEditors: Please set LastEditors
 * @Description: 
 */

// redis 前缀
export const REDIS_KEY = 'project:rp:';
// 红包默认队列 【未消费队列】
export const RP_DEFALUT_LIST = `${REDIS_KEY}defalut:`;
// 红包消费队列
export const RP_CONSUME_LIST = `${REDIS_KEY}consume:`;

