import * as rabbimq from "./rabbitmq";
import { Channel, Message } from "amqplib";
import { ORDER, EX_TYPE } from './rbEnum';
import * as mock from 'mockjs';


// 死信队列，针对无效信息的归属地
export async function orderDlq() {
    const connect = rabbimq.connection();
    const channel: Channel = await connect.createChannel();
    await channel.assertExchange(ORDER.ELX_EXCHANGE, EX_TYPE.TOPIC, { durable: true })
    const queueConsumer = await channel.assertQueue(ORDER.ELK_QUEUE, {
        exclusive: true,
    });
    await channel.prefetch(1, false);
    await channel.bindQueue(queueConsumer.queue, ORDER.ELX_EXCHANGE, 'order.#');

    channel.consume(queueConsumer.queue, async msg => {
        // console.info('【死信队列】收到的消息', msg.content.toString());
        channel.ack(msg, false);
    });
}

// 针对没有支付的，发送短信，
export async function orderSms() {
    const args = {
        exchange: ORDER.EXCHANE, exchangeType: EX_TYPE.DELAY,
        routerKey: ORDER.ROUTERKEY_CREATE, queueName: ORDER.QUEUE_NOTIFICATION,
        elx: ORDER.ELX_EXCHANGE, elk: ORDER.ELK_QUEUE
    };
    consumer(args, async (msg, channel) => {
        const { content } = msg;
        // console.log(`【短信】获取消息: ${content}`);
        // 根据消息ID，查询对应用户是否支付，如果支付ack, 否则发送短信&扔到死信队列，之后再说
        const success = mock.Random.boolean();
        if (success) {
            console.info(`【短信】无需发送短信 ${content}`, )
            channel.ack(msg, false);
        } else {
            // !可以扔到短信队列
            console.info(`【短信】该用户尚未支付，发送短信中----- ${content}`);
            channel.nack(msg, false, false);
        }
    })
}

// 创建订单，针对订单相关信息进行处理
export async function orderSummery() {
    const args = {
        exchange: ORDER.EXCHANE, exchangeType: EX_TYPE.DELAY,
        routerKey: ORDER.ROUTERKEY_SUMMARY, queueName: ORDER.QUEUE_SUMMARY,
        elx: ORDER.ELX_EXCHANGE, elk: ORDER.ELK_QUEUE
    };

    consumer(args, async (msg, channel) => {
        const { content, fields: { deliveryTag }, properties: { headers: { retry } } } = msg;
        // console.log(`【订单-消费】获取消息: ${content}`);
        // 模拟业务
        const success = await mock.Random.boolean();
        if (success) {
            console.info('【订单-消费】消费成功', content.toString());
            // broker 从内存磁盘中删除
            channel.ack(msg, false);
        } else {
            // 仍旧保留
            console.info(`【订单-消费】放入死信队列`);
            channel.nack(msg, false, false);
            // 最大重试次数 [加入redis 或 其他队列]
            //     if () {
            //         console.info(`【订单-消费】第 ${retry} 次消费 ${deliveryTag} 失败，尝试重试`);
            //         const requeue = true;
            //         channel.nack(msg, false, requeue);
            //     } else {
            //         console.info(`【订单-消费】第 ${retry} 次消费 ${deliveryTag} 失败，放入死信队列`);
            //         const requeue = false;
            //         channel.nack(msg, false, requeue);
            //     }
        }
    })
}


/**
 * 公用消费端
 * @param exchange 
 * @param exchangeType 
 * @param routerKey 
 * @param elx 死信交换机
 * @param elk 死信队列
 */
async function consumer(args: { exchange: string, exchangeType: any, routerKey: string, queueName: string, elx: string, elk: string },
    callback: (msg: Message, channel: Channel) => {}) {
    const { exchange, exchangeType, routerKey, queueName, elx, elk } = args;
    const connect = rabbimq.connection();
    const channel: Channel = await connect.createConfirmChannel();

    // ! topic + delay
    await channel.assertExchange(exchange, exchangeType, { durable: true, arguments: { 'x-delayed-type': EX_TYPE.TOPIC } })

    const queueConsumer = await channel.assertQueue(queueName, {
        exclusive: true,
        deadLetterExchange: elx,
        deadLetterRoutingKey: elk,
    });
    await channel.prefetch(1, false);
    await channel.bindQueue(queueConsumer.queue, exchange, routerKey);
    channel.consume(queueConsumer.queue, async msg => {
        // console.info('统一收到的消息', msg);
        callback(msg, channel);
    }, { noAck: false });
}
