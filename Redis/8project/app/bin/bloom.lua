--[[
KEYS[1]: bf.key
ARGV[1]: 模拟循环次数

生成随机32位置 十六进制字符串
1. 采用模版替换
2. 十六进制的用法
3. 三目运算
--]]
local random = math.random
local function uuid()
    local template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    return string.gsub(
        template,
        "[xy]",
        function(c)
            -- 三目运算: local z = a>b and x or y
            -- 0x: 十六进制
            -- 0xf: 15
            -- 0xb: 11
            local v = (c == "x") and random(0, 0xf) or random(8, 0xb)
            return string.format("%x", v)
        end
    )
end

local index = 0
local key = KEYS[1] -- bf key
local totalNum = ARGV[1] -- 循环次数
while index < totalNum do
    local value, _ = uuid()
    redis.call("BF.ADD", key, value)
    index = index + 1
end


--[[
!是否存在
--]]
local exists = redis.call("BF.EXISTS", key, value)
return exists


-- local result_1 = redis.call('BF.EXISTS', key, '100')
-- local result_2 = redis.call('BF.EXISTS', key, '101')
-- local result_3 = redis.call('BF.EXISTS', key, '1')
-- local result_4 = redis.call('BF.INFO', key)

-- redis.debug("sss----", result_1, result_2, result_3, result_4)
-- print(result_1, result_2, result_3)
-- print(result_4)

--[[

!Literals that start with 0x are hexadecimal integers. (base 16)
The number 0x6400 is 25600.
    
6 * 16^3 + 4 * 16^2 = 25600

For an example including letters (also used in hexadecimal notation where A = 10, B = 11 ... F = 15)
    
The number 0x6BF0 is 27632.
    
6 * 16^3 + 11 * 16^2 + 15 * 16^1 = 27632
24576    + 2816      + 240       = 27632

-- ]]
