--[[
Author: simuty
Date: 2020-11-26 14:10:25
LastEditTime: 2020-11-26 14:22:54
LastEditors: Please set LastEditors
Description: 

自增ID
--]]
local key = KEYS[1]
local id = redis.call("get", key)
if id == false then
    redis.call("set", key, 1)
    return key .. "00001"
else
    redis.call("set", key, id + 1)
    return key .. string.format("%04d", id + 1)
end
