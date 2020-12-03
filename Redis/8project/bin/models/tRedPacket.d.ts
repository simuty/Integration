import { Model, BuildOptions } from 'sequelize';
export interface ITRedPacketAttributes {
  id: number,
  type: number,
  userId: number,
  amount: number,
  sendDate: Date,
  total: number,
  unitAmount: number,
  stock: number,
  version: number,
  note?: string,
  createAt: Date,
  updateAt: Date,
}
export interface ITRedPacketModel extends ITRedPacketAttributes, Model {}
export type ITRedPacketModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ITRedPacketModel;
};