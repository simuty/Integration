"use strict";

module.exports = (app) => {
    const DataTypes = app.Sequelize;
    const sequelize = app.model;
    const attributes = {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: true,
            comment: "红包ID",
            field: "id",
        },
        userId: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "发红包用户ID",
            field: "user_id",
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "红包金额",
            field: "amount",
        },
        sendDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            primaryKey: false,
            autoIncrement: false,
            comment: "发红包时间",
            field: "send_date",
        },
        total: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "小红包总数",
            field: "total",
        },
        unitAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "单个小红包金额",
            field: "unit_amount",
        },
        stock: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "剩余小红包个数",
            field: "stock",
        },
        version: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: "0",
            primaryKey: false,
            autoIncrement: false,
            comment: "版本",
            field: "version",
        },
        note: {
            type: DataTypes.STRING(256),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: "备注",
            field: "note",
        },
    };
    const options = {
        // 实例对应的表名
        tableName: "t_red_packet",
        comment: "红包表",
        timestamps: false, //去除createAt updateAt
        freezeTableName: false, // 使用自定义表名
        // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
        // 将createdAt对应到数据库的created_at字段
        createdAt: "created_at",
        // 将updatedAt对应到数据库的updated_at字段
        updatedAt: "updated_at",
        //And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
        deletedAt: false, //'deleted_at',
        //删除数据时不删除数据，而是更新deleteAt字段 如果需要设置为true，则上面的deleteAt字段不能为false，也就是说必须启用
        paranoid: false,
    };
    const TRedPacketModel = sequelize.define(
        "tRedPacketModel",
        attributes,
        options,
    );
    return TRedPacketModel;
};
