import * as amqp from 'amqplib'


/** 
 * 1. 正常发送消息到交换机
 * 2. 如果超时，发送到死信队列
 * 3. 对应 consumerDLX.ts 、consumerEX.ts
 * 4. consumerEX.ts 消费生产的消息
 * 5. consumerDLX.ts 消费 生产的消息 被会收到 死信队列的消息
*/

(async function publish() {

    const url = `amqp://localhost:5672`;
    // 默认交换机-队列-路由
    const exchange = 'ex.exchange';
    const routingKey = 'ex.routerkey';

    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    // 默认交换机
    await channel.assertExchange(exchange, 'direct', { durable: false });
    // 发布消息
    channel.publish(exchange, routingKey, Buffer.from('hello world'), {
        expiration: 3000
    });
    await sleep(1);
    await connect.close();
    process.exit(0);
})();


function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time*1000));
}
