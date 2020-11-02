async function consumer(args: {exchange, queue, routingKey, connection}, cb: (msg: any, channel: any) => void){
    // 常规操作
    const channel = await args.connection.createChannel();
    await channel.assertExchange(args.exchange, 'direct', {durable: false});
    const queueA = await channel.assertQueue(args.queue, {exclusive: false});
    await channel.bindQueue(queueA.queue, args.exchange, args.routingKey);
    // !消费端限流
    await channel.prefetch(1, false);
    // 消费队列
    await channel.consume(queueA.queue, msg => {
        cb(msg, channel);
    });
}


export const run = (connection) => {
    consumer({
        exchange: 'order.exchange',
        routingKey: 'order.routingKey',
        queue: 'order.queue',
        connection,
    }, async (msg, channel) => {
        const data = msg.content.toString();
        console.info(`${(new Date()).getMinutes()}:${(new Date()).getSeconds()} consumer msg：%j`, data);
        console.log('msg: ', msg)
        return setTimeout(function () {
            try {
                /** 
                 * 针对队列信息进行业务操作
                 * 1. 直接消费
                 * 2. 重回队列
                 * 3. 扔到死信队列
                */
               channel.ack(msg);
                // if(Number(data) < 6) {
                //     // 手动ack
                //     channel.ack(msg);
                // } else {
                //     // !1. 重回队列
                //     channel.nack(msg);
                //     // !2. 扔到死信队列
                //     // 下个demo再整理。
                // }
            } catch (err) {
                console.error('消息 Ack Error：', err)
            }
            // 每隔1s执行一个任务
        }, 1000);
    })
}

