const request = require("./http");
const axios = require("axios");
const fs = require("fs");
const htmlParser = require("./htmlParser");
const {
  connect,
  lpush,
  rpop,
  hset,
  hget,
  hexists,
  del,
  publish,
  subscribe
} = require("./redis");
const md5 = require("js-md5");
const Logger = require("./logconf");
let nTotal = 0;
let num = 1;

module.exports.redisInit = async function(option) {
  try {
    await hset({
      key: `set${option.key}`,
      field: md5(option.url),
      value: option.url
    });
    await lpush({ key: `list${option.key}`, value: option.url });
    console.log(3333);
  } catch (error) {
    //console.log(error)
  }
};

module.exports.pageParse = async function(option) {
  let hrefUrl = null;
  let res = null;
  let Html = null;
  let host = null;
  try {
    hrefUrl = await rpop({ key: `list${option.key}` });
    // res = await request(hrefUrl);
    // host = res.request.host;
    res = await axios.get(hrefUrl);
    host = res.request.socket._host;
  } catch (error) {
    // console.log(error)
  }
  if (!res || !res.data) {
    return;
  }
  Html = new htmlParser(res.data);

  const result = Html.getElementsByTagName("img");
  const hrefResult = Html.getElementsByTagName("a");
  const imgs = result
    .map(item => {
      return dealwith(item.attributes["src"], host);
    })
    .filter(item => item != undefined);
  const hrefs = hrefResult
    .map(item => {
      return dealwith(item.attributes["href"], host);
    })
    .filter(item => item != undefined);
  if (imgs.length != 0) {
    console.log(11111);
    // await lpush({ key: 'mainimgUrl', value: JSON.stringify(imgs) });
    await publish({ channel: "mainimgUrl", message: JSON.stringify(imgs) });
  }
  if (hrefs.length != 0) {
    // await lpush({ key: 'mainhrefUrl', value: JSON.stringify(hrefs) });
    await publish({ channel: "mainhrefUrl", message: JSON.stringify(hrefs) });
  }

  // return {
  //   imgUrl: result.map(item => {
  //     return dealwith(item.attributes["src"], host);
  //   }),
  //   hrefUrl: hrefResult.map(item => {
  //     return dealwith(item.attributes["href"], host);
  //   })
  //   // host:
  // };
};

module.exports.addQueue = async function(option) {
  try {
    // const tasks = await rpop({ key: `main${option.key}` });
    // if (tasks === null) throw "null";
    for await (const task of JSON.parse(option.tasks)) {
      if (task === undefined) continue;
      const field = await hexists({
        key: `set${option.key}`,
        field: md5(task)
      });
      if (!field) {
        await hset({
          key: `set${option.key}`,
          field: md5(task),
          value: task
        });
        Logger.info(`${num++}1111111${option.key}:${task}`);
        await lpush({ key: `list${option.key}`, value: task });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.fileSave = async function(option) {
  const popResult = await rpop({ key: `list${option.key}` });
  if (!popResult) return;
  fileDown({ url: `${popResult}` });
};

/**
 * url过滤器
 * Url修正器
 *  */
function dealwith(url, host) {
  const http = /http/;
  const urlcom = /.(cn)|(com)/;
  const img = /.(png)|(jpeg)|(jpg)/;
  const filterUrl = /.(gif)|(js)|(css)/;

  //url过滤器
  if (typeof url === undefined || filterUrl.test(url)) {
    return;
  } else {
    url = String(url)
      .split("?")[0]
      .split("+")[0]
      .split("javascript")[0]
      .split("#")[0];
  }
  if (!urlcom.test(url) && !img.test(url)) {
    return `https://${host}${url}`;
  }
  if (!http.test(url)) {
    return `https:${url}`;
  }
  return url;
}

/**
 *解析url
 *   */
async function fileDown(option) {
  try {
    //判断图片类型
    // let imgType = isPng(option.url);
    // if (!imgType) {
    //   return;
    // }
    const Res = await request(option.url);
    fs.writeFile(
      `./image/${Date.now()}${nTotal++}.png`,
      Res.body,
      (res, error) => {
        // console.log(res, error, 38373737737373);
      }
    );
  } catch (error) {
    // console.log(error, 74772883774);
  }
}

function isPng(url) {
  const imgFormat = ["png", "jpg", "jpeg"];
  for (let item of imgFormat) {
    let index = url.indexOf(item);
    if (index >= 0) {
      return item;
    }
  }
  return null;
}
