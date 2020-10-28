import * as amqp from 'amqplib'

const url = `amqp://localhost:5672`
async function publish(msg: string, ttl: number) {
    const exchange = 'delayed-exchange';
    const exchangeType = 'x-delayed-message'; // x-delayed-message 交换机的类型
    const routingKey = 'delayed-routingKey';

    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true, arguments: {'x-delayed-type': 'direct' }})
    console.log('发布消息', msg, ttl, routingKey);
    channel.publish(exchange, routingKey, Buffer.from(msg), {
        headers: {
            'x-delay': ttl, // 一定要设置，否则无效
        }
    });
    channel.close();
}

(async function test(){
    await publish('msg0 1S Expire', 1000);
    await publish('msg0 2S Expire', 2000);
    await publish('msg0 3S Expire', 3000);
    // 最后一个不会触发
    process.exit(0);
})();
