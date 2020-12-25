import * as amqp from 'amqplib'

/**
 * 内容：发布【确认】
 * 备份交换机
 * 
 * !注：如果同时设置 alternateExchange && mandatory 以备份交换机为主
 * 
 * @param msg 发布的消息
 * @param connect rabbitmq connect
 */
async function publish(msg: string, connect: amqp.Connection) {
    const exchange = '5.alternate.exchange';
    const exchangeType = 'direct';
    const routingKey = '5.alternate.routingKey';
    const queueName = '5.alternate.queue'


    // 备份交换机
    const exchangeBak = '5.alternate.bak.exchange';
    const exchangeBakType = 'fanout';
    const exchangeBakQueue = '5.alternate.bak.queue';
    const exchangeBakRouter = '5.bak';


    // 接受确认的channel
    const channel = await connect.createConfirmChannel();
    // 设置备份交换机
    await channel.assertExchange(exchange, exchangeType, { alternateExchange: exchangeBak })
    const content = JSON.stringify({ msg });
    channel.publish(exchange, routingKey, Buffer.from(content), { mandatory: true }, (err, ok) => {
        if (err !== null) {
            console.log('发布消息-交换机-失败', err);
        } else {
            console.log('发布消息-交换机-确认', err, ok, content);
        }
    });

    // 备份交换机
    await channel.assertExchange(exchangeBak, exchangeBakType);
    const queueBak = await channel.assertQueue(exchangeBakQueue)
    await channel.bindQueue(queueBak.queue, exchangeBak, exchangeBakRouter);

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
