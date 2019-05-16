const fs = require("fs");
const request = require("request");
const Logger = require("./logconf");
const { userAgent, ipPools } = require("./config");
/**
 * 1.伪装user-agent
 * 2.伪装Ip
 *
 *
 *  */

module.exports = function(url) {
  const options = {
    method: "GET",
    url: url,
    encoding: null,
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
      "User-Agent": userAgent[Math.floor(Math.random() * userAgent.length)],
      "X-Forwarded-For": ipPools[Math.floor(Math.random() * ipPools.length)],
      referer: "https://www.58pic.com/"
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      if (error) {
        Logger.fatal(error);
        reject(error);
      } else {
        if (
          /^2/.test(response.statusCode) &&
          /image/.test(response.headers["content-type"])
        ) {
          resolve(response);
        } else {
          reject(false);
        }
      }
    });
  });
};
