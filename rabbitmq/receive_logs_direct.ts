import * as amqp from 'amqplib'
const url = `amqp://localhost`;

(async function receive(){
    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    const exchange = 'direct_logs';
    await channel.assertExchange(exchange, 'direct', { durable: false });


    const routingKeys = ['info', 'error', 'warning'];


    const queueA = await channel.assertQueue('queueA');
    await channel.bindQueue(queueA.queue, exchange, routingKeys[0]);
    await channel.bindQueue(queueA.queue, exchange, routingKeys[1]);
    await channel.bindQueue(queueA.queue, exchange, routingKeys[2]);

    const queueB = await channel.assertQueue('queueB');
    await channel.bindQueue(queueB.queue, exchange, routingKeys[1]);

    channel.consume(queueA.queue, msg => {
        console.log("队列AAAAA：", msg.content.toString())
    }, { noAck: true });
    channel.consume(queueB.queue, msg => {
        console.log("队列BBBBBBBB：", msg.content.toString())
    }, { noAck: true });
    // await connect.close();
})();

