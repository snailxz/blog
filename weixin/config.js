module.exports = {
  appID: 'wxdc120682d8639922',
  appSecret: 'fb9617f3c7ea8112a887d0b79f38978b',
  token: '94a08da1fecbb6e8b46990538c7b50b2',
  apiDomain: 'https://api.weixin.qq.com/',
  apis: {
    accessTokenApi: 'cgi-bin/token',
    userInfoAccessTokenApi: 'sns/oauth2/access_token',
    userInfo: 'sns/userinfo',
    createMenu: 'cgi-bin/menu/create',
    getTicket: 'cgi-bin/ticket/getticket'
  },
  // 1. 党建动态 500807602
  // 2. 典型风采 208740075
  // 3. 政策解读
  // 3.1 在线教育 208723579
  // 3.2 政策解读  208383494
  menu: {
    button: [
      {
        "type": "media_id", 
        "name": "党建动态", 
        "media_id": "500807602"
      }, 
      {
        "type": "media_id", 
        "name": "典型风采", 
        "media_id": "208740075"
      }, 
      {
        "name": "政策解读",
        "sub_button": [
          {
            "type": "media_id", 
            "name": "在线教育", 
            "media_id": "208723579"
          },
          {
            "type": "media_id", 
            "name": "政策解读", 
            "media_id": "208383494"
          },
          {
            "type": "view",
            "name": "知识测试",
            "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxba1587fef42b396c&redirect_uri=http%3A%2F%2Fexam.dugujiujian.net%2F&scope=snsapi_userinfo&response_type=code#wechat_redirect"
          }
        ]
      }
    ]
  }
}