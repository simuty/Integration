import * as amqp from 'amqplib';

const url = `amqp://localhost`;

(async function publish() {
    const connect = await amqp.connect(url);
    const channel = await connect.createChannel();
    const exchange = 'logs';
    await channel.assertExchange(exchange, 'fanout', {durable: false});
    channel.publish(exchange, '', Buffer.from('hello world'));
    setTimeout(function() {
        connect.close();
        process.exit(0);
    }, 500);
})();
