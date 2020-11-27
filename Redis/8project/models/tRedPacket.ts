import { Sequelize, DataTypes } from 'sequelize';
export default function (sequelize: Sequelize) {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: "红包ID",
      field: "id"
    },
    userId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "发红包用户ID",
      field: "user_id"
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "红包金额",
      field: "amount"
    },
    sendDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: false,
      autoIncrement: false,
      comment: "发红包时间",
      field: "send_date"
    },
    total: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "小红包总数",
      field: "total"
    },
    unitAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "单个小红包金额",
      field: "unit_amount"
    },
    stock: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "剩余小红包个数",
      field: "stock"
    },
    version: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: "版本",
      field: "version"
    },
    note: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "备注",
      field: "note"
    }
  };
  const options = {
    tableName: "t_red_packet",
    comment: "",
    indexes: []
  };
  const TRedPacketModel = sequelize.define("tRedPacketModel", attributes, options);
  return TRedPacketModel;
}