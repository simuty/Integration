import * as http from 'http'
import * as rabbitmq from './rabbitmq';
import * as order from './order';


http.createServer((req, res) => {
    if (req.url === '/create') {
        order.create();
    }
    if (req.url === '/update') {
        // order.();
    }
    res.end('hello world')
}).listen(3000, () => {
    rabbitmq.init();
    console.log('开启端口3000')
})