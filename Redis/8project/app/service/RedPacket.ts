import { Service } from 'egg';
import { fairMethod, speedMethod } from './RedPacketGenerate';


enum RP_TYPE {
  // 固定红包
  UNIT = 1,
  // 公平红包
  FAIR = 2,
  // 拼手速
  SPEED = 3,
}


export default class RedPacket extends Service {
  /**
   * 生成红包数据
   * 1. 生成一条红包数据
   * 2. 根据type生成不同类型的小红包
   * 3. 插入到用户用户表，缺失领取人的用户ID&时间
   * 4. redis 入队
   * @param args 
   */
  public async createRp(args: any) {
    const { userId, amount, sendDate, total, unitAmount, stock, note, type } = args;
    // 生成红包算法
    const rpList = this.generateRp(type, total, amount, unitAmount);
    // 插入红包表
    const { id } = await this.ctx.model.TRedPacket.create({ userId, amount, sendDate, total, unitAmount, stock, note, type });
    const userList: any[] = [];
    for (const smallAmount of rpList) {
      const tmp = {
        redPacketId: id,
        amount: smallAmount,
      };
      userList.push(tmp);
    }
    // 生成红包用户表
    await this.ctx.model.TUserRedPacket.bulkCreate(userList);
    // this.app.redis
  }

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
        node: '抢红包',
      };
      await ctx.model.TUserRedPacket.create(args);
      return true;
    }
    return false;

  }


  /**
     * 生成红包数据
     * @param type 1: 固定红包 2: 公平红包 3: 拼手速
     * @param total 小红包总数
     * @param amount 红包总金额 分
     * @param unitAmount 固定小红包金额 分
     */
  private generateRp(type: number, total: number, amount: number, unitAmount: number) {
    let list: number[] = [];
    switch (type) {
      case RP_TYPE.UNIT:
        list = Array(total).fill(unitAmount);
        break;
      case RP_TYPE.FAIR:
        list = fairMethod(amount, total);
        break;
      case RP_TYPE.SPEED:
        list = speedMethod(amount, total);
        break;
      default:
        break;
    }
    return list;
  }

}
