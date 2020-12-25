import * as amqp from "amqplib";

const url = `amqp://localhost:5672`;

(async function publish() {
    
    const queueName = "5.3.queue";
    const exchange = '5.3.producer-exchange';
    const exchangeType = 'direct';
    const routingKey = '5.3.producer-routingKey';


    try {
        const connect = await amqp.connect(url);
        const channel = await connect.createConfirmChannel();
        await channel.assertExchange(exchange, exchangeType, { durable: true })
        const queueA = await channel.assertQueue(queueName);

        await channel.bindQueue(queueA.queue, exchange, routingKey);
        await channel.consume(queueA.queue, (msg) => {
            console.log("接受到的消息", msg);
            channel.ack(msg, false);
        });
    } catch (error) {
        console.log(error);
    }
})();
