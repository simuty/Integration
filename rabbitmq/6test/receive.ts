// // import * as amqp from 'amqplib'
// const amqp = require('amqplib')
// const url = `amqp://localhost:5672`;

// amqp.connect(url).then(function(conn) {
//   process.once('SIGINT', function() { conn.close(); });
//   return conn.createChannel().then(function(ch) {
//     var ex = 'Test_topic';
//     var ok = ch.assertExchange(ex, 'topic', {durable: true});

//     ok = ok.then(function() {
//       return ch.assertQueue('test1', {exclusive: false,durable: true});
//     });

//     ok = ok.then(function(qok) {
//       var queue = qok.queue;
//       ch.bindQueue(queue, ex, "test.#");

//     //   return Promise.all(keys.map(function(rk) {
//     //     ch.bindQueue(queue, ex, rk);
//     //   })).then(function() { return queue; });
//     });

//     ok = ok.then(function(queue) {
//       return ch.consume(queue, logMessage, {noAck: false});
//     });
//     return ok.then(function() {

//       console.log(' [*] Waiting for logs. To exit press CTRL+C.');
//     });

//     function logMessage(msg) {
//         ch.ack(msg);
//         console.log(" [x] %s:'%s'",
//         msg.fields.routingKey,
//         msg.content.toString());
//     }
//   });
// }).then(null, console.warn);

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
        channel.nack(msg, false, true);
    });
    // await connect.close();
})();

