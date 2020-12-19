import * as amqp from "amqplib";

const url = `amqp://localhost:5672`;

(async function publish() {
    const exchange = '5.confirm.exchange';
    const exchangeType = 'direct';
    const routingKey = '5.confirm.routingKey';
    const queueName = "5.queue";
    try {
        const connect = await amqp.connect(url);
        const channel = await connect.createChannel();
        await channel.assertExchange(exchange, exchangeType, { durable: false })
        const queueA = await channel.assertQueue(queueName);

        await channel.bindQueue(queueA.queue, exchange, routingKey);
        await channel.consume(queueA.queue, (msg) => {
            // const data = msg.content.toString();
            // const { msg: index } = JSON.parse(data);
            // console.log('queueA', queueA)

            console.log("接受到的消息", msg);
            channel.ack(msg, false);

            // if (Number(index) > 4) {
            // // let content = JSON.parse(msg.content.toString());
            // // console.log("接受到的消息----", content);

            // //     content.try_attempt = content.try_attempt + 1 || 1;
            // //     const attempt = content.try_attempt;
            // //     content = Buffer.from(JSON.stringify(content));
            // //     msg.content = content;
    
            //     // console.log("接受到的消息", msg.content.toString());
            //     // console.log("attempt", attempt);

            //     channel.nack(msg, false, true);
            // } else {
            //     channel.ack(msg, false);
            // }
        });
    } catch (error) {
        console.log(error);
    }
})();
