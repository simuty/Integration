import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    this.ctx.body = await this.app.model.TRedPacket.findAll();
    await this.app.redis.set('key', 'value');
    
    // this.ctx.body = model;
    // this.app
  }
}
