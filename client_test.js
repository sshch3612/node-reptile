const axios = require("axios");
const fs = require("fs");
const htmlParser = require("./htmlParser");
const { connect, lpush, rpop, hset,hget, hexists, del } = require("./redis");
const md5 = require('js-md5');

let nTotal = 0;


class httpParse {
  constructor(initUrl) {
    this.initUrl = initUrl || "https://www.jianshu.com/";
    this.urlSave = [];
    this.data = null;
    this.sleepTime = 300;
    this.imgFormat = ["png", "jpg", "jpeg"];
    connect();
    this.init(this.initUrl);
  }

  async init(url) {
    try{
      await del({key:'url'})
      await hset({ key: "url", field:md5(url),value: url });
      await lpush({ key: "hrefUrl", value: url });
    }catch(error){
      // console.log(error)
    }
     
  }

  
  async hrefParser() {
    // const _this = this;
    // try {
    //   const res = await axios.get("https://www.jianshu.com/");
    //   _this.data = res.data;
    // } catch (error) {
    //   console.log(error);
    // }
    let Html = null;
    let Host = null;
    try {
      const hrefUrl = await rpop({ key: "hrefUrl" });
      const res = await axios.get(hrefUrl);

      Html = new htmlParser(res.data);

      const result = Html.getElementsByTagName("img");
      const hrefResult = Html.getElementsByTagName("a");

      result.map(async function(item, index){
        const url = item.attributes["src"];
        const http = /^http/;
        if (!http.test(url)) {
          // this.urlSave.push(`https:${url}`)
          const  field =  await hexists({ key: "url", field:md5(url) });
          if(!field){
            await hset({ key: "url", field:md5(url),value: url})
            await lpush({ key: "imageUrl", value: `https:${url}` });
          }
        }
      });

      hrefResult.map(async function(item, index){
        const url = item.attributes["href"];
        const http = /^http/;
        if (!http.test(url)) {
          const  field =  await hexists({ key: "href", field:md5(url) });
          if(!field){
            await hset({ key: "href", field:md5(url),value: `${hrefUrl}${url}`})
            await lpush({ key: "hrefUrl", value: `${hrefUrl}${url}` });
          }
        }
      });
    } catch (error) {
      // console.log(error);
    }
  }

  /**
   * 存储url
   */
  urlParse() {
    console.log(this.data, 333);

    const Interval = setInterval(
      async function() {
        const popResult = await rpop({ key: "imageUrl" });
        this.fileDown({ url: popResult });
        if (!popResult) {
          clearInterval(Interval);
        } else {
        }
      }.bind(this),
      this.sleepTime
    );
  }

  /**
   *解析url
   *   */

  async fileDown(option) {
    console.log(option, 444444333);
    if (!option.url) {
      return;
    }
    try {
      let index = this.isPng(option.url);
      if (!index) {
        return;
      }
      const Res = await axios.get(option.url, {
        responseType: "arraybuffer"
      });

      fs.writeFile(
        `./image/${Date.now()}${nTotal++}.${index}`,
        Res.data,
        (res, error) => {
          // console.log(res, error, 444);
        }
      );
    } catch (error) {
      // console.log(error, 4);
    }
  }

  isPng(url) {
    for (let item of this.imgFormat) {
      let index = url.indexOf(item);
      if (index >= 0) {
        return item;
      }
    }
    return null;
  }

  async render() {
    setInterval(
      await function() {
        this.hrefParser();
      }.bind(this),
      300
    );

    // this.urlParse();
  }
}

new httpParse().render();
