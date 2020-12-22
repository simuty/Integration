import * as amqp from 'amqplib'


(async function publish() {
    const url = `amqp://localhost:5672`;
    // 默认交换机-队列-路由
    const exchange = '6.delivery.limit.exchange';
    const queueExName = '6.delivery.limit.queue';
    const routingKey = '6.delivery.limit.routerkey';


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
