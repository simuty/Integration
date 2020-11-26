--[[
Author: simuty
Date: 2020-11-26 11:17:33
LastEditTime: 2020-11-26 14:06:12
LastEditors: Please set LastEditors
Description: 
参考链接：https://segmentfault.com/a/1190000019676878

!10秒内只能访问3次。 后续该脚本可以在nginx或者程序运行脚本中直接使用，判断返回是否为0，就0就不让其继续访问。
!以上，如果不使用redis+lua，那高并发下incr和expire就会出现原子性破坏，造成expire执行多次浪费
--]]

local times = redis.call("incr", KEYS[1]) -- key + 1 

if times == 1 then
    redis.call("expire", KEYS[1], ARGV[1]) -- 初始化时，设置过期时间
elseif times > tonumber(ARGV[2]) then -- 返回值如果大于限制次数，返回0
    return 0
end

return 1 -- 返回值为1:无限制，0:限制访问

