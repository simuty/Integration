import { Controller } from "egg";

export default class HomeController extends Controller {
    public async index() {
        // const { ctx } = this;
        // ctx.body = await ctx.service..sayHi('egg');
        const model = await this.app.model.TUserRedPacket.findByPk(1);
        return model;
    }
}
