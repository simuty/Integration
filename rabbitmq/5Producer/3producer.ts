import * as amqp from 'amqplib'
import { sleep } from "../comment/util";

const url = `amqp://localhost:5672`
async function publish(msg: number, ttl: number) {
    const exchange = '5.3.producer-exchange';
    const exchangeType = 'direct';
    const routingKey = '5.3.producer-routingKey';

    const connect = await amqp.connect(url);
    const channel = await connect.createConfirmChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true })
    const content = JSON.stringify({ msg, ttl });
    channel.publish(exchange, routingKey, Buffer.from(content), {}, (err, ok) => {
        console.log('发布消息-交换机-确认', err, ok, content);
    });
    channel.on('return', (args)=>{
        console.log("return: ", args);
    })
    channel.on('error', (args)=>{
        console.log("error: ", args);
    })
    channel.on('close', (args)=>{
        console.log("close: ", args);
    })
    await channel.waitForConfirms()
    await channel.close();
}

(async function test() {

    let i = 0;
    while (i < 3) {
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
