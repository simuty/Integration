-- 行注释
--[[
块注释    
--]]
--全局
num = 3

-- 变量
a1 = 5
local a2 = 6

function fun1()
    a3 = 7
    local a4 = 8 --局部变量
end
print("1.----变量分为：全局变量和局部变量")
print(a1, a2, a3, a4)

print("2.----循环与控制语句")
b1 = 1
while (b1 < num) do
    b1 = b1 + 1 -- 没有 【+= ++】 语法
    print("while循环", b1)
end
--[[
    数值 for 循环
for var=exp1, exp2, exp3 do end
var 从 exp1 变化到 exp2，每次变化以 exp3 为步长递增 var，并执行一次"执行体"。exp3 是可选的，如果不指定，默认为 1。
--]]
for i = 1, 4, 2 do
    print("for数值-循环", i)
end

--[[
    泛型循环
    i 是数组索引值，v 是对应索引的数组元素值。ipairs 是 Lua 提供的一个迭代器函数，用来迭代数组。
--]]
cArray = {
    "v1",
    "v2",
    "v3"
}
for i, v in ipairs(cArray) do
    print("for泛型-index: ", i, "value: ", v)
end

--[[
repeat...until循环
repeat...until 循环和 C 语言里面的 do...while() 作用是一样的。
--]]
d1 = 0
repeat
    d1 = d1 + 1
    print("repeat-", d1)
until (d1 > num)

--[[
    if 语句
    Lua 中有 8 个基本类型分别为：nil、boolean、number、string、userdata、function、thread 和 table。
    !boolean 类型只有两个可选值：true（真） 和 false（假），Lua 把 false 和 nil 看作是 false，其他的都为 true，数字 0 也是 true:
--]]
if false or nil then
    print("至少有一个是 true")
else
    print("false 和 nil 都为 false")
end

if 0 then
    print("数字 0 是 true")
else
    print("数字 0 为 false")
end

--[[
运算符

1. +加、 -减、 *乘、 /除、 %取余、 ^乘幂、 -负数
2. ==等于、【～=】不等于、>、<、>=、<=
3. and、or、【not】 
--]]
print("---------分割线---------")

e1 = true
e2 = true

if (e1 and e2) then
    print("e1 and e2 - 条件为 true")
end

if (e1 or e2) then
    print("e1 or e2 - 条件为 true")
end

print("---------分割线---------")

-- 修改 a 和 b 的值
e1 = false
e2 = true

if (e1 and e2) then
    print("e1 and e2 - 条件为 true")
else
    print("e1 and e2 - 条件为 false")
end

if (not (e1 and e2)) then
    print("not( e1 and e2) - 条件为 true")
else
    print("not( e1 and e2) - 条件为 false")
end

print("---------函数---------")
myprint = function(params)
    print("函数 ##", params, "##")
end

function add(num1, num2, functionPrint)
    sum = num1 + num2
    functionPrint(sum)
end
add(1, 3, myprint)

function maximun(array)
    local index = 1
    local value = array[index]
    for i, v in ipairs(array) do
        if v > value then
            index = i
            value = v
        end
    end
    return index, value
end
-- !Lua的下标不是从0开始的，是从1开始的。
print(maximun({800, 19, 1, 4, 8, 102}))

-- 可变参数 三点 ... 表示函数有可变的参数
function add(...)
    local sum = 0
    for i,v in ipairs{...} do 
        sum = sum + v
    end
    -- select("#",...) 来获取可变参数的数量
    -- .. 字符串拼接
    print("总共传入 " .. select("#",...) .. " 个数")
    return sum
end
print(add(1,2,3,4,5))
-- 斐波那契数列
function fib(n)
    if n<2 then return 1 end
    return fib(n-2) + fib(n+1)
end

--[[
    闭包
--]]
function newCounter()
    local i=0
    return function()
        i= i+1
        return i
    end
end
newCounter = newCounter()
newCounter()
newCounter()

--[[
    函数返回值，多个
--]]
function getUserInfo(id)
    print(id)
    return "haoel", 37, "haoel@hotmail.com", "https://coolshell.cn"
end
-- 似乎必须直接解构！！！
name, age, email, website, bGay = getUserInfo()
userInfo = getUserInfo()
-- haoel   37      haoel@hotmail.com       https://coolshell.cn    nil
print(name, age, email, website, bGay)
-- haoel
print(userInfo)

--[[
    函数返回值，多个
--]]
print("---------函数---------")
print("---------table 类型---------")

--[[
    table 类型
--]]

mytable = {}
-- table 里面值的设置和获取
mytable[1] = "元素1"
mytable["er"] = "元素2"
print(mytable[1])

-- 数组，lua里面的元素是从 1 开始的
array = {10,20,30,40,50}
--[[
    等价于
    array = {[1]=10, [2]=20, [3]=30, [4]=40, [5]=50}
--]]

-- 数组里面值得获取
print(array[1], array[2], array[3])
-- 字典
dictionary = {
    key1 = "value1",
    key2 = "value2",
    key3 = "value3"
}

-- 字典里面值得获取
print(dictionary.key1, dictionary.key2, dictionary.key3)
print("---------table 类型---------")

