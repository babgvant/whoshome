local http = require("socket.http")
local runScene = true
-- 5 Second timeout
http.TIMEOUT = 5

result, status = http.request("http://192.168.1.18:3001/home/0/simple")

luup.log('status: ' .. status)
if status == 200 then
	luup.log('result: ' .. result)
	runScene = (result == "false")
end

return runScene