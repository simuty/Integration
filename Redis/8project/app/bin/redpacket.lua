--[[
Author: simuty
Date: 2020-12-07 10:25:35
LastEditTime: 2020-12-08 16:04:30
LastEditors: Please set LastEditors
Description: 
--]]
-- 函数：尝试获得红包，如果成功，则返回json字符串，如果不成功，则返回空
---
-- 参数：
--- KEYS[1-3] 未消费队列名、已消费的队列名、hset key <集合: 去重用户>
--- ARGV[1] 用户ID
-- 返回值：nil 或者 json字符串
---- {userId: xxx, packetId: xxx, amount: 11} : 用户ID：userId，红包ID：packetId，红包金额：money

-- 用户是否抢过
local judge = redis.call("SISMEMBER", KEYS[3], ARGV[1])
if judge ~= 0 then
    return 100 -- 已经抢过了
else
    local item = redis.call("RPOP", KEYS[1]) -- 先取出一个小红包
    if item then
        local _item = cjson.decode(item)
        _item["userId"] = ARGV[1] -- 加入用户ID信息
        local newItem = cjson.encode(_item)
        redis.call("SADD", KEYS[3], ARGV[1]) -- 把用户ID放到去重的set里
        redis.call("LPUSH", KEYS[2], newItem) -- 把红包放到已消费队列里
        return newItem
    else
        return 200 -- 红包队列已经为空
    end
end
return nil
