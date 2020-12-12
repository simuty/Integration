import { Controller } from 'egg';
import { ENUMS } from '../lib';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    this.ctx.app.messenger.sendToAgent(ENUMS.MS_AGENT, '手动触发---------agent');
    this.ctx.app.messenger.sendToApp(ENUMS.MS_ACTION_PULL, '手动触发--app');

    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
