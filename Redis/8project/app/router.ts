import { Application } from 'egg';
    

export default (app: Application) => {
    const { controller, router } = app;

  /** ------------------ 红包相关 ------------------ */
  router.post('/redis/create', controller.redisController.create);
  router.post('/redis/grapSql', controller.redisController.grap_mysql);
  router.post('/redis/grapLua', controller.redisController.grap_lua);
  /** ------------------ 队列相关相关 ------------------ */
  router.post('/redis/list', controller.redisController.grap_lua);

};
