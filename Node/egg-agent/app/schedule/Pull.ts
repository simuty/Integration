import { Subscription } from 'egg';
import { ENUMS } from '../lib/index';

export default class Pull extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '100000', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log('定时任务--pulllllll');
    this.ctx.app.messenger.sendToApp(ENUMS.MS_ACTION_PULL, '定时发送的');
    this.ctx.app.messenger.sendToAgent(ENUMS.MS_AGENT, '定时发送的---');
  }
}
