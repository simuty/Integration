import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Test.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    const result = await ctx.service.test.sayHi('egg');
    assert(result === 'hi, egg');
  });
  it.only('生成红包', async () => {
    const args = { userId: 1, amount: 100, total: 20, type: 2, unitAmount: 0, stock: 20, note: '测试红包', sendDate: '2020-12-12' };
    await ctx.service.redPacket.createRp(args);
  });
});
