const https     = require('https')

module.exports = {
  get: (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        let buffer = []
        res.on('data', data => {
          buffer.push(data)
        })
        res.on('end', () => {
          let data = Buffer.concat(buffer).toString('utf-8')
          let res = JSON.parse(data)
          resolve(res)
        })
      }).on('error', err => {
        reject(err)
      })
    })
  },
  post: (host, url, data) => {
    return new Promise(async(resolve, reject) => {
      let post_data = JSON.stringify(data)
      //建立http请求
      let post_req = https.request({
        hostname: host,
        method: 'post',
        port: 443,
        path: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data) //参数长度
        }
      }, (res) => {
        let buffer = []
        res.on('data', data => {
          buffer.push(data)
        })
        res.on('end', () => {
          let data = Buffer.concat(buffer).toString('utf-8')
          let res = JSON.parse(data)
          resolve(res)
        })
      }).on('error', (e) => {
        reject(e)
      });
      //在这里写入需要发送的参数
      post_req.write(post_data);
      post_req.end();
    })
  }
}