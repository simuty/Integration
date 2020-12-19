import * as amqp from 'amqplib'

/**
 * 内容：发布【确认】
 * 1. 问题：如何确保消息发送到了交换机？
 * 
 * 2. createConfirmChannel
 * 
 * @param msg 发布的消息
 * @param connect rabbitmq connect
 */
async function publish(msg: string, connect: amqp.Connection) {
    const exchange = '5.confirm.exchange';
    const exchangeType = 'direct';
    const routingKey = '5.confirm.routingKey';

    // 接受确认的channel
    const channel = await connect.createConfirmChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: false })
    const content = JSON.stringify({ msg });
    const random = Math.random() < 0.4;
    console.log('随机出现❌', random);
    if (random) {
        // 为了演示发送不到交换机
        channel.close()
        // connect.close();
    }
    channel.publish(exchange, routingKey, Buffer.from(content), {}, (err, ok) => {
        if (err !== null) {
            console.log('发布消息-交换机-失败', err);
        } else {
            console.log('发布消息-交换机-确认', err, ok, content);
        }
    });
    await channel.waitForConfirms()
    await channel.close();
}


(async function testConfirmChannel() {
    const url = `amqp://localhost`;
    const connect = await amqp.connect(url)
    let index = 0;
    /** 
     * 
     * 1. 发布4条消息
     * 2. 如果成功则打印成功的消息
     * 3. 如果因为某种原因失败，则重试发布3次，最终记录失败消息
     * 
     * 失败原因
     * 1. 网络，connect.close、channel.close
     * 2. 其他故障
    */
    while (index < 4) {
        index++;
        await retryTest(index, 3);
    }
    /**
     * 发送消息
     * @param index 发送的消息
     * @param retryTime 单个消息的 重试次数
     */
    async function retryTest(index: number, retryTime: number) {
        try {
            console.log(`发送消息${index}`);
            await publish(`发送消息${index}`, connect);
        } catch (error) {
            if (retryTime > 0) {
                await sleep(3);
                console.log(`${index}重试, 次数为${retryTime}`)
                await retryTest(index, retryTime - 1)
            } else {
                // ! 如果单条消息重试后仍旧失败，则记录📝特殊处理
                console.error(`🚩🚩🚩 ${index} 需要特殊处理`);
            }
        }
    }
    process.exit(0);
})();


function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time * 1000);
    })
}



/**
 * 
 * 
// Example
console.log(Math.random() < 0.1); //10% probability of getting true
console.log(Math.random() < 0.4); //40% probability of getting true
console.log(Math.random() < 0.5); //50% probability of getting true
console.log(Math.random() < 0.8); //80% probability of getting true
console.log(Math.random() < 0.9); //90% probability of getting true
 * 
 * 
 */