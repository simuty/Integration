import { Sequelize, DataTypes } from 'sequelize';
export default function (sequelize: Sequelize) {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: "编号ID",
      field: "id"
    },
    redPacketId: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "红包编号",
      field: "red_packet_id"
    },
    userId: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "抢红包用户编号",
      field: "user_id"
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "抢红包金额",
      field: "amount"
    },
    grabTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: false,
      autoIncrement: false,
      comment: "抢红包时间",
      field: "grab_time"
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
    tableName: "t_user_red_packet",
    comment: "",
    indexes: []
  };
  const TUserRedPacketModel = sequelize.define("tUserRedPacketModel", attributes, options);
  return TUserRedPacketModel;
}