import * as amqp from 'amqplib'
import { sleep } from "../comment/util";

const url = `amqp://localhost:5672`
async function publish(msg: number, ttl: number) {
    const exchange = 'delayed-exchange';
    const exchangeType = 'x-delayed-message'; // x-delayed-message 交换机的类型
    const routingKey = 'delayed-routingKey';

    const connect = await amqp.connect(url);
    const channel = await connect.createConfirmChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true, arguments: {'x-delayed-type': 'direct' }})
    // console.log('发布消息', msg, ttl, routingKey);
    const content = JSON.stringify({msg, ttl});
    channel.publish(exchange, routingKey, Buffer.from(content), {
        headers: {
            'x-delay': ttl, // 一定要设置，否则无效,
            'x-death': [{count: 3, reason: 'rejected'}]
        }
    }, (err, ok)=>{
        console.log('发布消息-交换机-确认', err, ok, content);
    });
    await channel.waitForConfirms()
    await channel.close();
}

(async function test(){

    let i=0;
    while(i < 10){
        i++;
        await publish(i, 1000);
    }

    // await publish('msg0 过期时间', 1000);
    // await publish('msg0 过期时间', 2000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    // await publish('msg0 过期时间', 3000);
    process.exit(0);
})();
