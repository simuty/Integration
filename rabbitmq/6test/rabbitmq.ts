
// !应该写断言的。。。下次
import * as assert from 'assert'
import * as amqp from 'amqplib'
// import * as consumer from './consumer'


// 连接配置：https://www.squaremobius.net/amqp.node/channel_api.html#connect
// url | config
const config = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    // 最大连接数，0:无限
    // the size in bytes of the maximum frame allowed over the connection. 0 means no limit (but since frames have a size field which is an unsigned 32 bit integer, it’s perforce 2^32 - 1); I default it to 0x1000, i.e. 4kb, which is the allowed minimum, will fit many purposes, and not chug through Node.JS’s buffer pooling.
    frameMax: 0,
    // 心跳周期
    heartbeat: 0,
}

let connect: amqp.Connection;
// 最大连接次数...
let maxConnectTimes = 0;
let isConnect = false;
export const init = async () => {
    try {
        connect = await amqp.connect(config);
        // 监听error\close，重新连接
        connect.on('error', err => {
            reconnect(err, 'error');
        });
        // 什么时候会触发？网络异常、服务异常、管理后台删除
        connect.on('close', err => {
            reconnect(err, 'close');
        });
        console.info('[x]Rabbitmq connect success');
        // !注册执行消费者
        // 可以根据需求，多写几个？
        // consumer.run(connect);
        return connect;
    } catch (error) {
        reconnect(error, 'catch');
    }

}

const reconnect = (err, event) => {
    // 因为后台删除连接，会同时触发error、close, 为了不一次创建两个，所以做个限制
    if (!isConnect) {
        isConnect = true;
        maxConnectTimes++;
        console.error(`[x]Lost connection to RMQ. reconnectingCount: ${maxConnectTimes}. Reconnecting in 10 seconds...`);
        console.error('[x]Rabbitmq close: ', event, err);
        // 3秒连接一次
        return setTimeout(init, 1000 * 3);
    }
}

// 公用这个连接
export const connection = () => {
    return connect;
}
