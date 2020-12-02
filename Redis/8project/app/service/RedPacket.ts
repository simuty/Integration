import { Service } from "egg";

export default class RedPacket extends Service {
    /**
     * 1. 超发现象
     * 为了演示超发现象，抢红包过程没有加锁。
     * @param id 红包ID
     * @param userId 用户ID
     */
    public async getRedPacket_base(id: number, userId: number) {
        const { ctx } = this;
        const model = await ctx.model.TRedPacket.findByPk(id);
        if (!model) return false;
        const { stock, unitAmount } = model;
        if (stock > 0) {
            await ctx.model.TRedPacket.update(
                {
                    stock: stock - 1,
                },
                { where: { id } },
            );
            const args = {
                redPacketId: id,
                userId,
                amount: unitAmount,
                grabTime: new Date(),
                node: "抢红包",
            };
            await ctx.model.TUserRedPacket.create(args);
            return true;
        } else {
            return false;
        }
    }
}
