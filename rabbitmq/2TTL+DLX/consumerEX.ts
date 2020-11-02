import * as amqp from 'amqplib'

/** 
 * 对应producerDLX.ts 发送的消息进行消费
*/

(async function consumer() {

    // 交换机-路由
    const url = `amqp://localhost:5672`;
    // 死信交换机-路由
    const deadLetterExchange = 'dlx.exchange';
    const deadLetterRoutingKey = 'dlx.routingkey' 
    // 默认交换机-队列-路由
    const exchange = 'ex.exchange';
    const queueExName = 'ex.queue';
    const routingKey = 'ex.routerkey';

    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: false });
    const queueEX = await channel.assertQueue(queueExName, {
        exclusive: false,
        deadLetterExchange,
        deadLetterRoutingKey,
    });
    await channel.bindQueue(queueExName, exchange, routingKey);
    await channel.consume(queueEX.queue, msg => {
        console.log("消费队列", msg);
    }, {noAck: true});
})();
