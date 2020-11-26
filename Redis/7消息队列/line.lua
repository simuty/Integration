--[[
Author: simuty
Date: 2020-11-26 14:18:47
LastEditTime: 2020-11-26 14:18:55
LastEditors: Please set LastEditors
Description: 
当消费者是多线程或者多进程的时候，这里会存在竞争浪费问题。当前线程明明将 task_json 从 Zset 中轮询出来了，但是通过 Zrem 来争抢时却抢不到手。
这时就可以使用 LUA 脚本来解决这个问题，将轮询和争抢操作原子化，这样就可以避免竞争浪费。
--]]


local res = nil
local tasks = redis.pcall("zrevrangebyscore", KEYS[1], ARGV[1], 0, "LIMIT", 0, 1)
if #tasks > 0 then
  local ok = redis.pcall("zrem", KEYS[1], tasks[1])
  if ok > 0 then
    res = tasks[1] 
  end
end
return res