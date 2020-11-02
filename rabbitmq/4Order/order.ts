import * as rabbimq from "./rabbitmq";
import { ORDER, EX_TYPE } from './rbEnum';
import * as mock from 'mockjs';

export async function create() {
    const connct = rabbimq.connection();
    const channel = await connct.createConfirmChannel();
    // @ts-ignore
    // 统一业务，用一个交换机： 延迟+topic
    await channel.assertExchange(ORDER.EXCHANE, EX_TYPE.DELAY, {
        durable: true,
        arguments: {'x-delayed-type': EX_TYPE.TOPIC }
    });
    // 模拟一些假的数据
    let i = 0;
    while(i < 3){
        i++;
        // N分钟后，对没支付的进行通知
        const time = mock.Random.integer(500, 2000);
        const expiration = 1000 * 60 * 60;
        const content = { id: mock.Random.integer(1000), number: mock.Random.integer(1, 3), time };
        const msg =  JSON.stringify(content);

        // !场景1：创建订单，如果三分钟不付款，则发短信通知
        channel.publish(ORDER.EXCHANE, ORDER.ROUTERKEY_CREATE, Buffer.from(msg), {
            expiration,
            contentType: 'application/json',
            headers: {
                'x-delay': time, // 一定要设置，否则按一般的交换机
            },
            // 消息持久化
            deliveryMode: 2
        }, (err, ok) => {
            // 生产端监听消息是否被ack；比如，记录日志啥的
            // 如果消费端，nack, 则不会再次到这里
            // console.log("是否被ack----ok: ", err, ok);
            if (err !== null) {
                console.warn('【SMS】Message nacked!');
            } else {
                console.log('【SMS】Message acked');
            }
        });
        // !场景2, 发送后，供消费端消费
        channel.publish(ORDER.EXCHANE, ORDER.QUEUE_SUMMARY, Buffer.from(msg), {}, (err, ok) => {
            if (err !== null) {
                console.warn('【summary】Message nacked!');
            } else {
                console.log('【summary】Message acked');
            }
        })

    }
    // 如果创建需要确认的channel，需要等待
    // 生产者消息确认，一旦消息被投递到指定交换机，broker就会ack
    await channel.waitForConfirms()
    await channel.close();
};


