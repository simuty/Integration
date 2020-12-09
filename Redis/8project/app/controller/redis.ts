import { Controller } from "egg";

export default class RedisController extends Controller {
    /** ------------------ 红包相关 ------------------ */
    // 生成红包数据
    public async create() {
        const result = await this.service.redPacket.createRp(
            this.ctx.request.body,
        );
        this.ctx.body = result;
    }
    // 抢红包: 单mysql有问题的
    public async grap_mysql() {
        const { userId, redpacketId } = this.ctx.request.body;
        const result = await this.service.redPacket.getRedPacket_base(
            redpacketId,
            userId,
        );
        this.ctx.body = result;
    }
    // 抢红包: redis + lua
    public async grap_lua() {
        const { userId, redpacketId } = this.ctx.request.body;
        const result = await this.service.redPacket.getRedPacket_redis_lua(
            redpacketId,
            userId,
        );
        this.ctx.body = result;
    }
    /** ------------------ 延迟队列相关 ------------------ */
    
}
