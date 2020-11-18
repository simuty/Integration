/*
 * @Author: simuty
 * @Date: 2020-11-18 15:04:32
 * @LastEditTime: 2020-11-18 15:56:43
 * @LastEditors: Please set LastEditors
 * @Description: 
 * 
 */


 // 字符串转二进制
'a'.charCodeAt(0).toString(2)


// 数字转进制
const x = 97;
console.log(x.toString(2));  // 十进制转二进制  "1100001"
console.log(x.toString(8));  // 十进制转八进制  "141"
console.log(x.toString(16))  // 十进制转十六进制  "61"
console.log(x.toString(32)); // 十进制转三十二进制 "31"

// 其他进制转十进制
const x1 = '110';
console.log(parseInt(x1, 2)); // 2进制转十进制   6
console.log(parseInt(x1, 8)); // 8进制转十进制   72
console.log(parseInt(x1, 32)) // 32进制转十进制  1056


// 偶数 & 1 = 0
// 奇数 & 1 = 1
console.log(2 & 1)    // 0
console.log(3 & 1)    // 1


console.log(~~ 6.83)    // 6
console.log(6.83 >> 0)  // 6
console.log(6.83 << 0)  // 6
console.log(6.83 | 0)   // 6
// >>>不可对负数取整
console.log(6.83 >>> 0)   // 6



var a = 5
var b = 8
a ^= b
b ^= a
a ^= b
console.log(a)   // 8
console.log(b)   // 5


/**
 * 16进制颜色值转RGB
 * @param  {String} hex 16进制颜色字符串
 * @return {String}     RGB颜色字符串
 */
function hexToRGB(hex) {
    var hexx = hex.replace('#', '0x')
    var r = hexx >> 16
    var g = hexx >> 8 & 0xff
    var b = hexx & 0xff
    return `rgb(${r}, ${g}, ${b})`
}

/**
 * RGB颜色转16进制颜色
 * @param  {String} rgb RGB进制颜色字符串
 * @return {String}     16进制颜色字符串
 */
function RGBToHex(rgb) {
    var rgbArr = rgb.split(/[^\d]+/)
    var color = rgbArr[1]<<16 | rgbArr[2]<<8 | rgbArr[3]
    return '#'+ color.toString(16)
}
// -------------------------------------------------
hexToRGB('#ffffff')               // 'rgb(255,255,255)'
RGBToHex('rgb(255,255,255)')      // '#ffffff'
