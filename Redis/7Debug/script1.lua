local src = KEYS[1]
local dst = KEYS[2]
local count = tonumber(ARGV[1])

while count > 0 do
    local item = redis.call('rpop', src)
    redis.debug('dubug value:', item)
    if item == false then break end
    redis.call('lpush', dst, item)
    count = count -1
end

return redis.call('llen', dst);
