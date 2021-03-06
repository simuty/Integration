/*
 * @Author: simuty
 * @Date: 2020-11-18 15:04:32
 * @LastEditTime: 2020-11-19 18:35:19
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


console.log(~~6.83)    // 6
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


// /**
//  * 16进制颜色值转RGB
//  * @param  {String} hex 16进制颜色字符串
//  * @return {String}     RGB颜色字符串
//  */
// function hexToRGB(hex) {
//     var hexx = hex.replace('#', '0x')
//     var r = hexx >> 16
//     var g = hexx >> 8 & 0xff
//     var b = hexx & 0xff
//     return `rgb(${r}, ${g}, ${b})`
// }

// /**
//  * RGB颜色转16进制颜色
//  * @param  {String} rgb RGB进制颜色字符串
//  * @return {String}     16进制颜色字符串
//  */
// function RGBToHex(rgb: string) {
//     var rgbArr = rgb.split(/[^\d]+/)
//     var color = rgbArr[1] << 16 | rgbArr[2] << 8 | rgbArr[3]
//     return '#' + color.toString(16)
// }
// // -------------------------------------------------
// hexToRGB('#ffffff')               // 'rgb(255,255,255)'
// RGBToHex('rgb(255,255,255)')      // '#ffffff'



/** ---------------------- bit操作 -----------------------------  */
// https://juejin.im/post/6844903846947323918#heading-19

// !该函数用来返回x中从右边数第p位开始向右数n位二进制。
export function getBits(x: number, p: number, n: number) {
    return (x >> (p + 1 - n)) & ~(~0 << n);
}

const bit_key_1 = parseInt('168').toString(2);
const bit_key_2 = getBits(168, 5, 3)
const bit_key_3 = bit_key_2.toString(2);

console.log("168对应的二进制: ", bit_key_1)
console.log("从第5位开始取3位对应的十进制: ", bit_key_2)
console.log("从第5位开始取3位对应的二进制: ", bit_key_3)
/** 

168对应的二进制:  10101000
从第5位开始取3位对应的十进制:  5
从第5位开始取3位对应的二进制:  101

举个例子，调用getBits(168,5,3)后，返回168对应二进制10101000从右边数第5位开始向右3位二进制，也就是101。可以结合下图理解：
1. 一开始执行(x>>(p+1-n)) 这里是为了将期望获得的字段移动到最右边。用上面的例子，执行完后x变成  00010101
2. ~(~0<<n) 是为了生成右边n位全1的掩码。 对于上面的例子~(~0<<3) ,我们一起来分析下过程。
    1. 一开始执行~0生成全1的二进制,11111111。
    2. 然后左移3位变成11111000。
    3. 最后执行圆括号左边的~，取反变成00000111，现在掩码生成完成。
3. 最后执行中间的那个&，将(x>>(p+1-n))和~(~0<<n)与运算，取出期望字段。对于上面的例子，对应过程图如下：

一 00010101 
二 00000111
三 00000101 
*/

console.log('---------');

/** 
 * !该函数返回x中从第p位开始的n个（二进制）位设置为y中最右边n位的值，x的其余各位保持不变。

第一眼看到这个函数代码还是有一些恐怖的，不用害怕，我们一层层解析，相信你一定能感受位运算的精妙之处！
我们先要将函数拆成两个部分看待，第一部分是( x & ~( ~( ~0 << n ) << ( p+1-n ) ) )记为$0；另一部分是(y & ~(~0 << n) ) << (p+1-n)记为$1。
下面分析下$0和$1的作用：

其中，$0是为了将x中期望修改的n个二进制清0。在例子(#2)中，$0返回的二进制应该为：10000000，注意到红体部分已经被清0。
$1是为了取出y最右边n个二进制，并与x中待修改的那n个二进制对齐。在例子(#2)中，$1返回的二进制应该：00010100。
最后$0 | $1 ,也就是将$1的值设置到$0当中。在在例子(#2)中，$0 | $1 = 10000000 | 00010100 = 10010100，设置完成。

下面具体分析下$0是如何将期望修改的n个二进制清0的：

既然是清0，我们可以想使用到最早所学的掩码，所以可以将$0以&为分割符拆成两段看待，其中~( ~( ~0 << n ) << ( p+1-n ) )生成x清0所需要的掩码。
一开始执行 ~(~0 << n) 生成右边n个1，其余全为0的。代入例子(#2)的参数，也就是~(~0 << 4)，结果为:00001111。这里为了方便记忆，把~(~0 << n)记为?0 。
然后接着执行?0 << (p+1-n)，将右边n个1左移到相应位置上。代入例子(#2)的参数及上一步的结果，应执行00001111 << (5+1-4)，结果为00111100。这里将?0 << (p+1-n)记为?1。
最后执行最外层~?1，生成清零所需的掩码。代入例子(#2)的参数及上一步的结果，应执行~00111100 ，结果为11000011，掩码生成完毕。
最后执行 x & ~?1，用掩码将x中待清零的位清0。代入例子(#2)的参数及上一步的结果，应执行10101000 & 11000011结果为10000000，清0成功。

下面具体分析下$1是如何取出y最右边n个二进制并与x中待修改的那n个二进制对齐的：

首先 ~(~0 << n)和$0第一个步骤一样，不过这次直接用这个结果当作掩码。代入例子(#2)的参数，也就是~(~0 << 4)，结果为00001111。这里将~(~0 << n)记为@@0。
接着 执行 y & @@0 ，用掩码的原理将y最右边的n位取出。代入例子(#2)的参数及上一步的结果，应执行00000101 & 00001111，结果为00000101。这里将y & @@0记为?1 。
最后执行 ?1 << (p+1-n)，左移到对应位置上。代入例子(#2)的参数及上一步的结果，也就是00000101 << (5+1-4)，结果为00010100，生成结束。

*/


export function setBits(x: number, p: number, n: number, y: number) {
    return (x & ~(~(~0 << n) << (p + 1 - n))) |
        (y & ~(~0 << n)) << (p + 1 - n);
}

// 举个例子(#2)，调用setbits(168, 5, 4, 0b0101)后，将168对应二进制10101000从右边数第5位开始的4个二进制位设置为0101，设置完后变成10010100，最后将结果返回。可以结合下图理解：
const bit_key_11 = setBits(168, 5, 4, 0b0101)
const bit_key_22 = bit_key_11.toString(2);
const bit_key_33 = parseInt('0101', 2)


console.log("168-偏移后的 十进制: ", bit_key_11)
console.log("68-偏移后的 二进制: ", bit_key_22)
console.log(`偏移的二进制是: 0b0101, 对应的十进制为：${0b0101}`)
console.log('---------');

/** 
168-偏移后的 十进制:  148
68-偏移后的 二进制:  10010100
偏移的二进制是: 0b0101, 对应的十进制为：5
*/



export function isOdd(value: number) {
    return (value & 1); // 取出最后一位二进制，若为1则是奇数
}


/**
 * 统计二进制数据中1的个数
 * @param num 二进制数据
 * 1. 八进制 0o
 * 2. 二进制 0b
 * 3. 十六进制 0x
 * 4. 其余的都按十进制计算
 */
export function bitcount(num: number) {
    // int x =0xba;//10111010
    let count = 0;
    while (num != 0) {
        num = num & (num - 1);
        count++;
    }
    return count;
}



const num1 = bitcount(0o377);
const num2 = bitcount(0xff);
const num3 = bitcount(0b11111111);
const num4 = bitcount(255);
console.log("二进制中1的总数为:", num1, num2, num3, num4);
