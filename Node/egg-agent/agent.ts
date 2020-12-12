export default (agent) => {
    class ClusterStrategy extends agent.ScheduleStrategy {
      start() {
        // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
        // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
        // agent.mq.subscribe(schedule.scene, () => this.sendOne());
        // this.agent.messenger.sendToApp(ENUMS.MS_ACTION_PULL, 'hhw');
        agent.messenger.on(ENUMS.MS_AGENT, data => {
            this.sendOne(data);
        });
      }
    }
    agent.schedule.use('custom', ClusterStrategy);
};

// import { Agent } from 'egg';
import { ENUMS } from './app/lib';

// // https://eggjs.org/zh-cn/basics/app-start.html

// // app.js
// export default class AgentBootHook {
//   private readonly agent: Agent;
//   constructor(agent: Agent) {
//     this.agent = agent;
//   }
//   configWillLoad() {
//     // 此时 config 文件已经被读取并合并，但是还并未生效
//     // 这是应用层修改配置的最后时机
//     // 注意：此函数只支持同步调用
//     // 例如：参数中的密码是加密的，在此处进行解密
//     //   this.app.config.mysql.password = decrypt(this.app.config.mysql.password);
//     // 例如：插入一个中间件到框架的 coreMiddleware 之间
//     //   const statusIdx = this.app.config.coreMiddleware.indexOf('status');
//     //   this.app.config.coreMiddleware.splice(statusIdx + 1, 0, 'limit');
//     console.log('=== agent--configWillLoad---');
//   }
//   async didLoad() {
//     // 所有的配置已经加载完毕
//     // 可以用来加载应用自定义的文件，启动自定义的服务
//     // 例如：创建自定义应用的示例
//     //   this.app.queue = new Queue(this.app.config.queue);
//     //   await this.app.queue.init();
//     //   // 例如：加载自定义的目录
//     //   this.app.loader.loadToContext(path.join(__dirname, 'app/tasks'), 'tasks', {
//     //     fieldClass: 'tasksClasses',
//     //   });
//     console.log('=== agent--didLoad---');
//   }
//   async willReady() {
//     // 所有的插件都已启动完毕，但是应用整体还未 ready
//     // 可以做一些数据初始化等操作，这些操作成功才会启动应用
//     // 例如：从数据库加载数据到内存缓存
//     //   this.app.cacheData = await this.app.model.query(QUERY_CACHE_SQL);
//     console.log('=== agent--willReady---');

//   }
//   async didReady() {
//     // 应用已经启动完毕
//     //   const ctx = await this.app.createAnonymousContext();
//     //   await ctx.service.Biz.request();
//     console.log('=== agent--didReady---');

//   }
//   async serverDidReady() {
//     // http / https server 已启动，开始接受外部请求
//     // 此时可以从 app.server 拿到 server 的实例
//     //   this.app.server.on('timeout', socket => {
//     //     // handle socket timeout
//     //   });
//     console.log('=== agent--serverDidReady---');
//     this.agent.messenger.sendToApp(ENUMS.MS_ACTION_PULL, 'hhw');
//     this.agent.schedule.use('custom', ClusterStrategy);
//   }

// }


// import { agent } from 'egg';


// class ClusterStrategy extends ScheduleStrategy {
//     start() {
//       this.interval = setInterval(() => {
//         this.sendOne();
//       }, this.schedule.interval);
//     }
//   }


