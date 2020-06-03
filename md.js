const base64 = require('js-base64').Base64

var res = base64.encode('{ a: 1, b: 2, c: \'黄祥劲\' }')
console.log(res, typeof res)
console.log(base64.decode(res))
