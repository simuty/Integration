/*
 * @Author: simuty
 * @Date: 2020-12-03 10:58:22
 * @LastEditTime: 2020-12-29 19:00:50
 * @LastEditors: Please set LastEditors
 * @Description:
 * 
 * 参考：https://blog.csdn.net/guaidoukx/article/details/87949095?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-4.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-4.control
 * https://blog.csdn.net/weixin_47216116/article/details/108409351
 * https://www.cnblogs.com/Lee-yl/p/12749070.html
 * 
 * AliasMethod： 随机采样算法
 * 1. 生成数组的时间复杂度：O(N)
 * 2. 采样复杂度O(1)
 * 
 * 线段法二分法查找时间复杂度O(logn)
 * 
 * Alias Method具体算法如下：
1. 按照上面说的方法，将整个概率分布拉平成为一个1*N的长方形即为Alias Table，构建上面那张图之后，储存两个数组，
一个里面存着第i列对应的事件i矩形站的面积百分比【也即其概率】，上图的话数组就为Prab[23, 1, 13, 13]，
另一个数组里面储存着第i列不是事件i的另外一个事件的标号，像上图就是Alias[2 NULL 1 1]

2.产生两个随机数，
第一个产生1~N 之间的整数i，决定落在哪一列。
扔第二次骰子，0~1之间的任意数，判断其与Prab[i]大小，如果小于Prab[i]，则采样i，如果大于Prab[i]，则采样Alias[i]

1. 一个更好的办法是用两个队列
    队列A储存：面积大于1的节点标号，
    队列B存储：面积小于1的节点标号，
2. 每次从两个队列中各取一个标号；
    1. 将大的补充到小的之中，小的出队列，
    2. 再看大的减去补给之后，如果大于1，继续放入A中，如果等于1，则也出去，如果小于1则放入B中。
这样算法复杂度为O(n)
 * 
 */


export function createAliasTable(tmpList: number[]) {
    const L = tmpList.length;
    // 记录位置：与单位1对比，放入不同的队列
    const [samllQueue, largeQueue] = [[], []];
    // 记录柱子下边部分的概率值
    const underList = new Array(L).fill(0);
    // 记录柱子上边部分来自哪个柱子，如果是-1表示没有来源。
    const upList = new Array(L).fill(-1);

    // 扩大L倍 && 记录大小
    tmpList.map((value, index) => {
        const area = L * value;
        underList[index] = area;
        area < 1 ? samllQueue.push(index) : largeQueue.push(index);
    })
    console.log('===============')
    console.log('原数组:', tmpList);
    console.log('samllQueue', samllQueue)
    console.log('largeQueue', largeQueue)
    console.log('underList', underList);
    console.log('upList', upList);
    console.log('===============')
    while (samllQueue.length && largeQueue.length) {

        // 从大小中各任取一个
        const smallIndex = samllQueue.pop();
        const largerIndex = largeQueue.pop();
        console.log("取大小index：", smallIndex, largerIndex);
        // 柱子下侧
        underList[largerIndex] = underList[largerIndex] + underList[smallIndex] - 1.0;
        // 
        upList[smallIndex] = largerIndex;
        // 记录大于1的那个概率，给了别人以后，剩下部分是不是还是大于1（是不是还能继续给别人）
        underList[largerIndex] < 1.0 ? samllQueue.push(largerIndex) : largeQueue.push(largerIndex);
        console.log('---------------')
        console.log('samllQueue', samllQueue)
        console.log('largeQueue', largeQueue)
        console.log('underList', underList);
        console.log('upList', upList);
        console.log('---------------')
    }
    return [underList, upList]
}


function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const list = [0.4, 0.3, 0.2, 0.1]
// const list = [0.1, 0.2, 0.3, 0.4]
const [underList, upList] = createAliasTable(list)
console.log(underList, upList)

let i = 0;
while (i < 10) {
    i++;
    const k = randomInt(0, list.length-1);
    const c = Math.random();
    const result = upList[k] > c ? k : underList[k];
    console.log(result, k, c)
    // console.log('采样结果：', result)
}

// [ 0.4, 0.8, 1, 0.8000000000000003 ] 
// [ 3, 3, -1, 2 ]

//
// [ 1, 0.6000000000000001, 0.8, 0.4 ] 
// [ -1, 0, 0, 1 ]