import { Service } from "egg";

/**
 * Test Service
 */
export default class RedPacket extends Service {
    // 获取红包接口
    public async getRedPacket() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi("egg");
    }
    // 扣减抢红包数
    public async decreaseRedPacket() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi("egg");
        // return ctx.model.TRedPacketModel.findAll();
    }
}
