import { Service } from 'egg';
import { fairMethod, speedMethod } from './RedPacketGenerate';
import * as fs from "fs";
import * as path from "path";

enum RP_TYPE {
    // 固定红包
    UNIT = 1,
    // 公平红包
    FAIR = 2,
    // 拼手速
    SPEED = 3,
}


// redis 前缀
const REDIS_KEY = 'project:rp:';
// 红包默认队列 【未消费队列】
const RP_DEFALUT_LIST = `${REDIS_KEY}:list:defalut:`;
// 红包消费队列
const RP_CONSUME_LIST = `${REDIS_KEY}:list:consume:`;
// 用于用户去重
const RP_USER_SET = `${REDIS_KEY}uniq:`;


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
        // 1. 插入红包表
        const { id } = await this.ctx.model.TRedPacket.create({ userId, amount, sendDate, total, unitAmount, stock, note, type });
        // 2. 生成红包算法
        const rpList = this.generateRp(type, total, amount, unitAmount);
        const redPacketList: any[] = [];
        for (const smallAmount of rpList) {
            redPacketList.push({
                redPacketId: id,
                amount: smallAmount,
            });
            
        }
        // 3. 生成红包用户表
        const list = await this.ctx.model.TUserRedPacket.bulkCreate(redPacketList);
        // 4. 插入待消费队列
        const redisList: any[] = [];
        for (const item of list) {
            const {id, redPacketId: rpId, amount} = item;
            redisList.push(JSON.stringify({
                amount, rpId, id
            }))
        }
        const redisListkey = `${RP_DEFALUT_LIST}${id}`
        await this.app.redis.lpush(redisListkey, ...redisList);
        return list;
    }

    /**
       * 1. 超发现象
       * 为了演示超发现象，抢红包过程没有加锁。
       * @param id 红包ID
       * @param userId 用户ID
       */
    public async getRedPacket_base(packetId: number, userId: number) {
        const { ctx } = this;
        const model = await ctx.model.TRedPacket.findByPk(packetId);
        if (!model) return false;
        const { stock, unitAmount } = model;
        if (stock > 0) {
            await ctx.model.TRedPacket.update(
                {
                    stock: stock - 1,
                },
                { where: { id: packetId } },
            );
            const args = {
                redPacketId: packetId,
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
     * redis+lua抢红包
     * @param packetId 
     * @param userId 
     */
    public async getRedPacket_redis_lua(packetId: number, userId: number) {
        const redisDefalueKey = `${RP_DEFALUT_LIST}${packetId}`;
        const redisConsumeKey = `${RP_CONSUME_LIST}${packetId}`;
        const redisSetKey = `${RP_USER_SET}${packetId}`;
        const filePath = path.join(__dirname, '../bin/redpacket.lua');
        const luaScript = fs.readFileSync(filePath, "utf8");
        const result = await this.app.redis.eval(luaScript, 3,  redisDefalueKey, redisConsumeKey, redisSetKey, userId);
        if(result === 100){
            console.log('已经抢过了～', userId)
        }
        if(result === 200){
            console.log('红包空了', userId)
        }
        if(typeof result === 'string') {
            console.log('抢红包成功', result)
        }
        return result;
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
