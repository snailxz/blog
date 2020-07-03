const axios        = require('./http.js')
const wxConfig     = require('./config.js')
const stringRandom = require('string-random') // 生成随机字符串
const sha1         = require('sha1')  // sha加密模块

let at = {
  accessToken: null,
  expiresTime: 0
}

// 获取常用 AccessToken
const getAccessToken = () => {
  return new Promise(async(resolve, reject) => {
    if (Date.now() < at.expiresTime && at.accessToken) {
      resolve(at.accessToken)
    } else {
      const url = `${wxConfig.apiDomain + wxConfig.apis.accessTokenApi}?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.appSecret}`
      const res = await axios.get(url)
      if (res.access_token && res.expires_in) {
        at.accessToken = res.access_token
        at.expiresTime = res.expires_in * 1000 + Date.now()
      }
      resolve(at.accessToken)
    }
  })
}

// 获取用户信息 AccessToken
const getUserInfoAccessTokenApi = (code) => {
  return new Promise(async(resolve, reject) => {
    const url = `${wxConfig.apiDomain + wxConfig.apis.userInfoAccessTokenApi}?grant_type=authorization_code&appid=${wxConfig.appID}&secret=${wxConfig.appSecret}&code=${code}`
    try {
      const res = await axios.get(url)
      // console.log(url, res)
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  setMenu: (menuInfo) => {  // 设置menu
    return new Promise(async(resolve, reject) => {
      const token = await getAccessToken()
      try {
        const res =  await axios.post('api.weixin.qq.com', `/cgi-bin/menu/create?access_token=${token}`, {
          "button": menuInfo ? JSON.parse(menuInfo) : wxConfig.menu.button
        })
        resolve(res)
      } catch(err) {
        reject(err)
      }
    })
  },
  getUserInfo: (code) => {  // 获取用户信息
    return new Promise(async(resolve, reject) => {
      const tokenres = await getUserInfoAccessTokenApi(code)
      const url = `${wxConfig.apiDomain + wxConfig.apis.userInfo}?access_token=${tokenres.access_token}&openid=${tokenres.openid}&lang=zh_CN`
      try {
        const res =  await axios.get(url)
        resolve({
          httpCode: 200,
          statusCode: 0,
          status: 'success',
          data: res
        })
      } catch(err) {
        reject(err)
      }
    })
  },
  getWebConfig: (weburl) => {  // 获取网页参数签名
    return new Promise(async(resolve, reject) => {
      const token = await getAccessToken()
      const url = `${wxConfig.apiDomain + wxConfig.apis.getTicket}?access_token=${token}&type=jsapi`
      try {
        const res =  await axios.get(url)
        const noncestr = stringRandom(16)
        const timestamp = parseInt(Date.now()/1000)
        const reqStr = [
          'jsapi_ticket=' + res.ticket,
          'noncestr=' + noncestr,
          'timestamp=' + timestamp,
          'url=' + weburl
        ].join('&')
        const signature = sha1(reqStr)
        resolve({
          httpCode: 200,
          statusCode: 0,
          status: 'success',
          data: {
            timestamp,
            noncestr,
            signature
          }
        })
      } catch(err) {
        reject(err)
      }
    })
  }
}