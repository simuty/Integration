import * as amqp from 'amqplib'

/** 
 * 针对死信队列，进行消费
 * 对应producerDLX.ts
*/

(async function consumer() {

    const url = `amqp://localhost:5672`;
    // 死信交换机-路由
    const deadLetterExchange = 'dlx.exchange';
    const deadLetterRoutingKey = 'dlx.routingkey'
    const deadLetterQueue = 'dlx.queue';

    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    // 默认交换机
    await channel.assertExchange(deadLetterExchange, 'direct', { durable: false });
    // 队列，超时发动到死信队列
    const queueDLX = await channel.assertQueue(deadLetterQueue, {exclusive: false});
    await channel.bindQueue(deadLetterQueue, deadLetterExchange, deadLetterRoutingKey);
    await channel.consume(queueDLX.queue, msg => {
        console.log("消费死信队列", msg);
    }, {noAck: true});
})();
