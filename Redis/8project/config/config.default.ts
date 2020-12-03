import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606462863712_9729';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 关闭： invalid csrf token.
  config.security = { csrf: { enable: false } };

  const sequelize: typeof config.sequelize = {
    logging: true,
    dialect: 'mysql', // 表示使用mysql
    host: '127.0.0.1', // 连接的数据库主机地址
    port: 3306, // mysql服务端口
    database: 'study', // 数据库名
    username: 'root', // 数据库用户名
    password: '', // 数据库密码
    define: { // model的全局配置
      timestamps: false, // 添加create,update,delete时间戳
      paranoid: false, // 添加软删除
      freezeTableName: false, // 防止修改表名为复数
      underscored: false, // 防止驼峰式字段被默认转为下划线
    },
    dialectOptions: { // 让读取date类型数据时返回字符串而不是UTC时间
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
  };


  // 合并插件配置
  const pluginConfig = {
    sequelize,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
    ...pluginConfig,
  };
};
