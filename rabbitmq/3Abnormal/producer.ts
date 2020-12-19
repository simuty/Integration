import * as rabbitmq from './rabbitmq';

export async function publish() {
    // 常规操作，用最简单的direct
    const exchange = '3.order.exchange';
    const routingKey = '3.order.routingKey';
    const exchangeType = 'direct';

    const connect = rabbitmq.connection();
    if(!connect) {
        console.log('连接不存在');
    }
    const channel = await connect.createChannel();
    await channel.assertExchange(exchange, exchangeType, {durable: false});

    let i = 0;
    while (i<10) {
        i++;
        // 模拟发送消息
        channel.publish(exchange, routingKey, Buffer.from(`${i}`))
    }
    channel.close();
}
