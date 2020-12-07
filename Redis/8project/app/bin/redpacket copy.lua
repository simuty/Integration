--[[
Author: simuty
Date: 2020-12-07 10:25:35
LastEditTime: 2020-12-07 15:57:02
LastEditors: Please set LastEditors
Description: 
--]]
-- 函数：尝试获得红包，如果成功，则返回json字符串，如果不成功，则返回空
--- 
-- 参数：未消费队列名、已消费的队列名、去重的Map名、用户ID
---- 
-- 返回值：nil 或者 json字符串
---- {userId: xxx, packetId: xxx, money: 11} : 用户ID：userId，红包ID：packetId，红包金额：money

-- 如果用户已抢过红包，则返回nil
-- if redis.call("hexists", KEYS[3], KEYS[4]) ~= 0 then

if redis.call("hexists", KEYS[4]) ~= 0 then
    print('1111')
    return nil
else
    -- 先取出一个小红包
    local hongBao = redis.call("rpop", KEYS[1])
    if hongBao then
        local x = cjson.decode(hongBao)
        -- 加入用户ID信息
        x["userId"] = KEYS[4]
        local re = cjson.encode(x)
        -- 把用户ID放到去重的set里
        redis.call("hset", KEYS[3], KEYS[4], KEYS[4])
        -- 把红包放到已消费队列里
        redis.call("lpush", KEYS[2], re)
        return re
    end
end
return nil
