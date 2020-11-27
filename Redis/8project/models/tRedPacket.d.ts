import { Model, BuildOptions } from 'sequelize';
export interface ITRedPacketAttributes {
  id: number,
  userId: number,
  amount: number,
  sendDate: Date,
  total: number,
  unitAmount: number,
  stock: number,
  version: number,
  note?: string,
}
export interface ITRedPacketModel extends ITRedPacketAttributes, Model {}
export type ITRedPacketModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ITRedPacketModel;
};