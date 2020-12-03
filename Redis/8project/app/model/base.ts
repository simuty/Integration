// sequlize 相关配置

module.exports = app => {
    const DataTypes = app.Sequelize;
    const sequelize = app.model;
    const attributes = {
      
    };
    const options = {
      // 实例对应的表名
      tableName: 't_red_packet',
      comment: '红包表',
      timestamps: false, // 去除createAt updateAt
      freezeTableName: false, // 使用自定义表名
      // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
      // 将createdAt对应到数据库的created_at字段
      createdAt: 'created_at',
      // 将updatedAt对应到数据库的updated_at字段
      updatedAt: 'updated_at',
      // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
      deletedAt: false, // 'deleted_at',
      // 删除数据时不删除数据，而是更新deleteAt字段 如果需要设置为true，则上面的deleteAt字段不能为false，也就是说必须启用
      paranoid: false,
    };
    const TRedPacketModel = sequelize.define(
      'tRedPacketModel',
      attributes,
      options,
    );
    return TRedPacketModel;
  };
  