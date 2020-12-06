import { Controller } from 'egg';

export default class RedPacketController extends Controller {
  // 抢红包
  public async grap() {
    const { userId, redpacketId } = this.ctx.request.body;
    const result = await this.service.redPacket.getRedPacket_base(redpacketId, userId);
    this.ctx.body = result;
  }
}
