import { Application } from 'egg';
import IORedis = require('ioredis');
const REDIS = Symbol('Application#ioredis');

export default {
    // 拓展app实例，可以直接用egg-redis
    // @ts-ignore
    get redis(this: Application): IORedis.Redis {
        if (!this[REDIS]) {
            this[REDIS] = new IORedis(this.config.redis);
        }
        return this[REDIS];
    }

}

  // app.ts
//   export default app => {
//     app.beforeStart(async () => {
//       await Promise.resolve('egg + ts');
//     });
//   };
