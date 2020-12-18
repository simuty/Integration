import * as amqp from 'amqplib'

const url = `amqp://localhost:5672`;

(async function publish() {
    const exchange = "5.topic.exchange";
    const routingKey = "info.*";
    const exchangeType = "topic";
    const queueName = '5.topic.queue'
    // 备份
    const backupExchange = '5.backup.exchange'
    const backupQueue= '5.topic.backup.queue'
    const backupRouingkey = '*';
    
    try {
        const connect = await amqp.connect(url);

        
        const channel = await connect.createChannel();
        await channel.assertExchange(exchange, exchangeType);
        const queueA = await channel.assertQueue(queueName);
        await channel.bindQueue(queueA.queue, exchange, routingKey);
        await channel.consume(queueA.queue, msg => {
            console.log("接受到的消息", msg.content.toString());
            channel.nack(msg, false, true);
        });


        // 备份交换机
        // const channelB = await connect.createChannel();
        // await channelB.assertExchange(backupExchange, exchangeType);
        // const queueB = await channelB.assertQueue(backupQueue);

        // await channelB.bindQueue(queueB.queue, backupExchange, backupRouingkey);
        // await channelB.consume(queueB.queue, msg => {
        //     console.log("备份交换机--接受到的消息", msg.content.toString());
        // }, { noAck: true });
    } catch (error) {
        console.log(error);
    }
})();

