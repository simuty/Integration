import { Application } from 'egg';

// https://www.javazhiyin.com/66747.html
/**
 * https://www.cnblogs.com/zxporz/p/10813709.html
 * https://www.cnblogs.com/zxporz/tag/redis/
 * https://my.oschina.net/LucasZhu/blog/1827116
 *
 *
 * lua脚本
 * https://github.com/ZhuBaker/redis-lua/blob/master/src/main/resources/ratelimiter/rate_limiter.lua
*/


export default (app: Application) => {
  const { controller, router } = app;

  // https://github.com/niantianlei/red-packet/blob/master/src/com/nian/controller/UserRedPacketController.java
  // https://github.com/niantianlei/red-packet
  router.get('/', controller.home.index);
  // 生成红包
  router.post('/redPacket/create', controller.redPacket.create);
  // redis 队列
  router.post('/redPacket/grapSql', controller.redPacket.grap_mysql);
  router.post('/redPacket/grapLua', controller.redPacket.grap_lua);

};
