const axios = require("axios");
const fs = require('fs');
const https  = require('https');
const  request =  require('request');
const { userAgent, ipPools } = require("./config");
// const Logger = require('./logconf');

/**
 * 1.伪装user-agent
 * 2.伪装Ip
 * 
 * 
 *  */
const options = {
  method: 'GET',
  url: 'https://icon.qiantucdn.com/img/searchnew/wechat-g.png',
  encoding: null,
  // 'X-Forwarded-For':'47.94.105.1',
    headers: {
      'Accept':
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": userAgent[Math.floor(Math.random() * userAgent.length)],
        "X-Forwarded-For": ipPools[Math.floor(Math.random() * ipPools.length)],
        'referer':'https://www.58pic.com/'
    }

};
request(options,function (error, response, body){

  console.log(response.headers["content-type"]);
  // Logger.info(response)
  console.log(response,4444444);
  fs.writeFile('./def1.png',body,function(){
    console.log(arguments);
  })
})