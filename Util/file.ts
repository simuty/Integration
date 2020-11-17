/*
 * @Author: simuty
 * @Date: 2020-11-17 10:50:51
 * @LastEditTime: 2020-11-17 10:53:35
 * @LastEditors: Please set LastEditors
 * @Description: 
 */

// import * as _ from 'lodash';
// import * as archiver from 'archiver';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as formstream from 'formstream';

// class name {
//     constructor(parameters) {

//     }

//     /**
//      * 压缩文件
//      *
//      * @param {string} source 资源路径
//      * @param {string} out 输出路径，如：tmp/12.zip
//      * @param {string} tag 是否嵌套目录， 如解压后，tag/234/12.zip
//      * @returns
//      * @memberof name
//      */
//     public async zipDirectory(source: string, out: string, tag: string) {
//         const archive = archiver('zip', { zlib: { level: 9 } });
//         const stream = fs.createWriteStream(out);
//         return new Promise((resolve, reject) => {
//             // 压缩包的文件路径
//             archive.directory(source, `${tag}/${tag}`).on('error', (err) => reject(err)).pipe(stream);
//             stream.on('close', () => resolve());
//             archive.finalize();
//         });
//     }

//     /**
//      * 下载文件
//      * @static
//      * @param {string} sourceMW_URL 资源文件
//      * @param {string | URL} savePath 保存路径
//      * @param {string} fileName 文件名
//      * @returns {Promise<any>}
//      */
//     public async downloadFile(sourceURL: string, savePath: string, fileName: string): Promise<any> {
//         // 创建目录
//         this.mkdirsSync(savePath);
//         const filePath = path.join(savePath, fileName);
//         const writeStream = fs.createWriteStream(filePath);
//         return await new Promise(async (resolve, reject) => {
//             const result = await this.ctx.curl(sourceURL, { timeout: 3000, streaming: true });
//             if (result.status !== 200) {
//                 throw new CallError('下载失败', result.status);
//             }
//             result.res.pipe(writeStream);
//             writeStream.on('finish', () => {
//                 resolve('文件写入成功');
//             });
//             writeStream.on('error', (err) => {
//                 throw new CallError(err, httpStatus.UNPROCESSABLE_ENTITY);
//             });
//             writeStream.on('close', (err) => {
//                 resolve('close');
//             });
//         });
//     }

//     delDir(dirPath: string) {
//         let files: any[] = [];
//         if (fs.existsSync(dirPath)) {
//             files = fs.readdirSync(dirPath);
//             files.forEach((file, index) => {
//                 const curPath = path.join(dirPath, file);
//                 if (fs.statSync(curPath).isDirectory()) {
//                     this.delDir(curPath); // 递归删除文件夹
//                 } else {
//                     fs.unlinkSync(curPath); // 删除文件
//                 }
//             });
//             fs.rmdirSync(dirPath);
//         }
//     }

//     // 递归创建目录 同步方法
//     mkdirsSync(dirname: string) {
//         if (fs.existsSync(dirname)) {
//             return true;
//         } else {
//             if (this.mkdirsSync(path.dirname(dirname))) {
//                 fs.mkdirSync(dirname);
//                 return true;
//             }
//         }
//     }

//     private async uploadFile(filePath: string): Promise<string> {
//         const { appId, home } = this.config.fileUpload.apiCommonUpload;
//         const url = `${this.config.rest.fileUpload.url}/services/api/file.uploadFile`;

//         // https://github.com/node-modules/urllib
//         const form = formstream();
//         form.file('file', filePath);
//         form.field('appId', appId);
//         form.field('home', home);

//         try {
//             const result = await this.ctx.curl(url, {
//                 method: 'POST',
//                 dataType: 'json',
//                 timeout: 20000,
//                 headers: form.headers(),
//                 stream: form,
//             });
//             const { status, data } = result;
//             if (status !== 200) {
//                 this.app.loggerELK.info(this.ctx, '上传文件失败', { data });
//             }
//             return `${data.data.domain}${data.data.fileFullName}`;
//         } catch (error) {
//             this.app.loggerELK.info(this.ctx, '上传文件失败', { error });
//             return '';
//         }
//     }
// }
