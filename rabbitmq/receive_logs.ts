import * as amqp from 'amqplib'
const url = `amqp://localhost`;

(async function receive(){
    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    const exchange = 'logs';
    await channel.assertExchange(exchange, 'fanout', { durable: false });


    const queueA = await channel.assertQueue('');
    await channel.bindQueue(queueA.queue, exchange, '');

    channel.consume(queueA.queue, msg => {
        console.log("队列AAAAA：", msg.content.toString())
    }, { noAck: true });
    // await connect.close();
})();

