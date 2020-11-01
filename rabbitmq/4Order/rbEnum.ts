// rabbitmq 相关配置
export enum EX_TYPE {
    TOPIC = 'topic',
    DIRECT = 'direct',
    HEADERS = 'headers',
    FANOUT = 'fanout',
    DELAY = 'x-delayed-message',
}

// 订单相关mq
export enum ORDER {
    // 相关业务一个交换机
    EXCHANE = 'order.exchange',
    // 路由key
    ROUTERKEY_CREATE = 'order.create',
    ROUTERKEY_SUMMARY = 'order.#',
    // 两个队列
    QUEUE_NOTIFICATION = 'order.notification',
    QUEUE_SUMMARY = 'order.summary',
    // 死信
    ELX_EXCHANGE = 'order.dlx.exchange',
    ELK_QUEUE = 'order.dlq.queue'
}


export const CONFIG = {
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


