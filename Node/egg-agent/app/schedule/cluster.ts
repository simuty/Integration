// import { Subscription } from 'egg';

// export default class Cluster extends Subscription {
//     static get schedule() {
//         return {
//             interval: '3s',
//             type: 'cluster',
//         };
//     }

//     // subscribe 是真正定时任务执行时被运行的函数
//     async subscribe() {
//         console.log('定时任务--pulllllll');
//         this.ctx.logger.info('cluster_log');

//     }
// }


const Subscription = require('egg').Subscription;
class ClusterTask extends Subscription {
  static get schedule() {
    return {
      type: 'custom',
      interval: '3s'
    };
  }
  async subscribe(data) {
    console.log('got custom data:', data);
    // await this.ctx.service.someTask.run();
  }
}
module.exports = ClusterTask;