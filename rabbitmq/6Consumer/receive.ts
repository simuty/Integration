import * as amqp from 'amqplib'

/** 
 * 消费者 确认消息
 * 
 * 1. 消费者重试3次，《采用quonum queue + delivery-limit: 3》
 * 2. 
*/

(async function consumer() {

    // 交换机-路由
    const url = `amqp://localhost:5672`;
    // 死信交换机-路由
    const deadLetterExchange = '6.dlx.exchange';
    const deadLetterRoutingKey = '6.dlx.routingkey' 
    const deadLetterQueue = '6.dlx.queue' 
    // 默认交换机-队列-路由
    const exchange = '6.delivery.limit.exchange';
    const queueExName = '6.delivery.limit.queue';
    const routingKey = '6.delivery.limit.routerkey';

    
    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: false });

    // 死信队列相关，为了web ui 展示数据
    await channel.assertExchange(deadLetterExchange, 'direct', { durable: false });
    const queueDL = await channel.assertQueue(deadLetterQueue)
    await channel.bindQueue(queueDL.queue, deadLetterExchange, deadLetterRoutingKey);


    const queueEX = await channel.assertQueue(queueExName, {
        exclusive: false,
        deadLetterExchange,
        deadLetterRoutingKey,
        arguments: {
            'x-queue-type': 'quorum',
            'x-delivery-limit': 3
        }
    });
    await channel.bindQueue(queueEX.queue, exchange, routingKey);
    await channel.consume(queueEX.queue, msg => {
        console.log("消费队列", msg);
        channel.nack(msg, false, true)
    });
})();
