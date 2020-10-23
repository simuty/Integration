import * as amqp from 'amqplib'

const url = `amqp://localhost`;

(async function publish(){
    const exchange = 'topic_logs';
    const msg = 'hello world';
    // bothqueue、firstqueue、secondqueue
    const keys = ['quick.orange.rabbit', 'quick.orange.fox', 'lazy.brown.fox'];
    // 1. 创建链接
    const connect = await amqp.connect(url);
    // 2. 创建channel
    const channel = await connect.createChannel();
    // 3. 创建or连上 交换机
    // 3.1 直连方式；
    await channel.assertExchange(exchange, 'topic', { durable: false });

    let i = 0;
    while(i<1){
        const index = random(3);
        // 4. 消息发给交换机
        channel.publish(exchange, keys[index], Buffer.from(msg));
        console.log(`[x] Sent ${msg}-- ${keys[index]}`);
        i++;
    }
    await sleep(1);
    await connect.close();
    process.exit(0);
})();

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time*1000));
}

function random(max: number){
    return Math.floor(Math.random() * Math.floor(max));
}

