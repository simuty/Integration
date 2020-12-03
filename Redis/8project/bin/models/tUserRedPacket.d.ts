import { Model, BuildOptions } from 'sequelize';
export interface ITUserRedPacketAttributes {
  id: number,
  redPacketId: number,
  userId: number,
  amount: number,
  grabTime: Date,
  note?: string,
  createAt: Date,
  updateAt: Date,
}
export interface ITUserRedPacketModel extends ITUserRedPacketAttributes, Model {}
export type ITUserRedPacketModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ITUserRedPacketModel;
};