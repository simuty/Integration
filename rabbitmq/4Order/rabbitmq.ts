import * as amqp from 'amqplib'
import * as consumer from './consumer';

const config = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    // 最大连接数，0:无限
    // the size in bytes of the maximum frame allowed over the connection. 0 means no limit (but since frames have a size field which is an unsigned 32 bit integer, it’s perforce 2^32 - 1); I default it to 0x1000, i.e. 4kb, which is the allowed minimum, will fit many purposes, and not chug through Node.JS’s buffer pooling.
    // frameMax: 0,
    // 心跳周期
    // heartbeat: 0,
}


let connect: amqp.Connection;
let isConnect = false;
let maxConnectTimes = 0;

const init = async () => {
    try {
        connect = await amqp.connect(config);
        connect.on('error', (err) => {
            reconnect(err, 'error');
        });
        connect.on('close', (err) => {
            reconnect(err, 'close');
        });
        console.info(`[rabbitmq] Rabbitmq connect success ${new Date()}`);
        // 消费者
        // 订单-消费
        consumer.orderSummery();
        // 订单-短信
        consumer.orderSms();
        // 死信队列
        consumer.orderDlq();
        return connect;
    } catch (error) {
        reconnect(error, 'catch')
    }
}

export const connection = () => {
    if (!connect){
        throw new Error('[rabbitmq] Not connect');
    }
    return connect;
}


const reconnect = (error, event) => {
    if (!isConnect) {
        console.error(`[rabbitmq] Lost connect; Reconnect number ${maxConnectTimes}`);
        console.error(`[rabbitmq] Rabbitmq close error: ${error}`);
        console.error(`[rabbitmq] Rabbitmq close event: ${event}`);
        return setTimeout(init, 5000);
    }
}

export {init};