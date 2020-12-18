import * as amqp from 'amqplib'

/**
 * 内容：发布【确认】
 * 1. 问题：如何确保消息发送到了交换机？
 * 
 * 2. createConfirmChannel
 * 
 * https://www.cnblogs.com/520playboy/p/6925196.html
 * 
 * @param msg 发布的消息
 * @param connect rabbitmq connect
 */
async function publish(msg: string, connect: amqp.Connection) {
    const exchange = '5.mandatory.exchange';
    const exchangeType = 'direct';
    const routingKey = '5.mandatory.routingKey';

    // 接受确认的channel
    const channel = await connect.createConfirmChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: false })
    const content = JSON.stringify({ msg });
    channel.publish(exchange, '', Buffer.from(content), { mandatory: true }, (err, ok) => {
        if (err !== null) {
            console.log('发布消息-交换机-失败', err);
        } else {
            console.log('发布消息-交换机-确认', err, ok, content);
        }
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


(async function testConfirmChannel() {
    const url = `amqp://localhost`;
    const connect = await amqp.connect(url)
    await publish(`发送消息--`, connect);

    process.exit(0);
})();


function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time * 1000);
    })
}
