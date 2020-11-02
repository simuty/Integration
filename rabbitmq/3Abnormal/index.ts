import * as http from 'http'
import * as rabbitmq from './rabbitmq';
import * as producer from './producer';

/** 
 * 实现功能
 * 1. 启动node服务 【 $ ts-node index.ts 】 
 *      1. 包含：重联、启动消费端
 * 2. 接口请求：http://127.0.0.1:3000/producer； 触发【生产者生产信息】
 * 3. 【消费端】
 *      1. 监听队列进行消费
 *      2. 限流，其实设置一下参数就行了
 *      3. 待完成：根据业务，扔到死信队列 ？
*/

http.createServer((req, res) => {
    if (req.url === '/producer') {
        producer.publish();
    }
    res.end('hello world')
}).listen(3000, () => {
    rabbitmq.init();
    console.log('开启端口3000')
})