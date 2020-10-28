import * as amqp from 'amqplib'
const url = `amqp://localhost`;

(async function receive(){
    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    const exchange = 'topic_logs';
    await channel.assertExchange(exchange, 'topic', { durable: false });


    const queueA = await channel.assertQueue('queue_topic_A');
    // # 匹配多个单词
    await channel.bindQueue(queueA.queue, exchange, '*.orange.*');

    const queueB = await channel.assertQueue('queue_topic_B');
    // * 可以替代一个单词
    await channel.bindQueue(queueB.queue, exchange, '#');

    channel.consume(queueA.queue, msg => {
        console.log("队列AAAAA：", msg.content.toString())
    }, { noAck: true });
    channel.consume(queueB.queue, msg => {
        console.log("队列BBBBBBBB：", msg.content.toString())
    }, { noAck: true });
    // await connect.close();
})();

