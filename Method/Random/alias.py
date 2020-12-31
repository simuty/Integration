import numpy as np

def alias_setup(probs):
    """
    以图为例，凡是4代表的就是概率类型数的意思
    a，记录下面那些部分的概率值（乘以4以后）
    b，记录上面部分来自哪个根柱子，用哪根柱子的不来用来补足，使之概率为1
    :param probs: 是一个概率的list
    :return:
    """
    num = len(probs)
    a = np.zeros(num, dtype=np.float32)
    b = np.ones(num, dtype=np.int)*-1  # -1 用来表示，本身自己就足够了，和那些用第一根柱子（下标0）的区分开来
    print(a, b)
    small, large = [], []  # 记录乘以4以后的概率 大于1还是小于1 的下标
    for i, prob in enumerate(probs):
        a[i] = num * prob  # 概率乘以类型数（4）
        if a[i] < 1.0:
            small.append(i)
        else:
            large.append(i)
            
    while len(small) > 0 and len(large) > 0:
        smaller = small.pop()  # 从大小中各任取一个
        larger = large.pop()

        a[larger] = a[smaller] + a[larger] - 1.0  # a用来记录本身的概率，而不是加上去的那一部分的概率
        b[smaller] = larger  # b用来记录完成每个柱子=1的操作，补自哪个柱子
    
        if a[larger] < 1.0:  # 记录大于1的那个概率，给了别人以后，剩下部分是不是还是大于1（是不是还能继续给别人）
            small.append(larger)
        else:
            large.append(larger)
        
    return a, b

print(alias_setup([0.4,0.1,0.2,0.3]))
# """
#     作者：Troublemaker
#     功能：alias method 算法
#     日期：2019/11/22 16:15
#     脚本：alias_method.py
# """
# import numpy as np


# def create_alias_table(Prob_val):
#     """
#     :param Prob_val: 传入概率列表
#     :return: 返回一个accept 概率数组 和 alias的标号数组
#     """
#     L = len(Prob_val)
#     # 初始化两个数组
#     accept_prob = np.zeros(L)   # 存的是概率
#     alias_index = np.zeros(L, dtype=np.int)  # 存的是下标/序号

#     print("aaa-", alias_index)

#     # 大的队列用于存储面积大于1的节点标号，小的队列用于存储面积小于1的节点标号
#     small_queue = []
#     large_queue = []

#     # 把Prob_val list中的值分配到大小队列中
#     for index, prob in enumerate(Prob_val):
#         accept_prob[index] = L*prob

#         if accept_prob[index] < 1.0:
#             small_queue.append(index)
#         else:
#             large_queue.append(index)

#     # 1.每次从两个队列中各取一个，让大的去补充小的，然后小的出small队列
#     # 2.在看大的减去补给小的之后剩下的值，如果大于1，继续放到large队列；如果恰好等于1，也出队列；如果小于1加入small队列中
#     while small_queue and large_queue:
#         small_index = small_queue.pop()
#         large_index = large_queue.pop()
#         # 因为alias_index中存的：另一个事件的标号，那现在用大的概率补充小的概率，标号就要变成大的事件的标号了
#         alias_index[small_index] = large_index
#         # 补充的原则是：大的概率要把小的概率补满（补到概率为1），然后就是剩下的
#         accept_prob[large_index] = accept_prob[large_index] + accept_prob[small_index] - 1.0
#         # 判断补完后，剩下值的大小
#         if accept_prob[large_index] < 1.0:
#             small_queue.append(large_index)
#         else:
#             large_queue.append(large_index)

#     return accept_prob, alias_index


# def alias_smaple(accept_prob, alias_index):
#     N = len(accept_prob)

#     # 扔第一个骰子，产生第一个1~N的随机数,决定落在哪一列
#     random_num1 = int(np.floor(np.random.rand()*N))
#     # 扔第二个骰子，产生0~1之间的随机数，判断与accept_prob[random_num1]的大小
#     random_num2 = np.random.rand()

#     # 如果小于Prab[i]，则采样i，如果大于Prab[i]，则采样Alias[i]
#     if random_num2 < accept_prob[random_num1]:
#         return random_num1
#     else:
#         alias_index[random_num1]
        
# # 算法到这里就结束啦.....

# lis = [1/2, 1/3, 1/12, 1/12]
# get = create_alias_table(lis)
# print(get)
# val = alias_smaple(get[0], get[1])
# print(val)