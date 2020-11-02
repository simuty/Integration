// @ts-ignore
module.exports = app => {
    return {
      schedule: {
        type: 'rabbitmq', // 扩展定时任务类型, 具体参考 [Egg.js Schedule](https://Quinton.org/zh-cn/basics/schedule.html#%E6%89%A9%E5%B1%95%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E7%B1%BB%E5%9E%8B)
        worker: 'one',
        exchange: 'workflowNewExchange', // MQ exchange
        queue: 'workflowNewQueue', // 队列名
      },
      // schedule 就是上面的 schedule
      // @ts-ignore
      async task(ctx, { schedule: { queueName }, msg, ackEvent }) {
          console.log(queueName, msg, ackEvent);
        // do something stuff
      },
    };
  };