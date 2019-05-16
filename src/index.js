const {
  connect,
  hgetall,
  lpush,
  del,
  rpop,
  ltrim,
  lrange
} = require("./redis");
const { redisInit, pageParse, addQueue, fileSave } = require("./utilParser");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require("worker_threads");
const { redisOption } = require("./config");
const Logger = require("./logconf");

class createTask {
  constructor(initUrl) {
    this.initUrl = initUrl || "https://zhen.meishichina.com/";
    this.sleepTime = 300;
    this.nTotal = 1;
  }

  async clearRedis() {
    try {
      await del({ key: "setimgUrl" });
      await del({ key: "sethrefUrl" });
      await ltrim({ key: "listimgUrl" });
      await ltrim({ key: "listhrefUrl" });
      await ltrim({ key: "mainimgUrl" });
      await ltrim({ key: "mainhrefUrl" });
    } catch (error) {}
  }
  async createThead() {
        // let worker = new Worker(__filename, { workerData: null });
        const w1 = new Worker('./imgurlQueue.js',{ workerData: null })
        const w2 = new Worker('./hrefurlQueue.js',{ workerData: null })
        const w3 = new Worker('./hrefParse.js',{ workerData: null })
        const w4 = new Worker('./fileDownload.js',{ workerData: null })
  }

  async waitTasks() {
    // while (true) {
    setInterval(async () => {
      this.nTotal++;
      try {
        await pageParse({ key: "hrefUrl" });
        await addQueue({ key: "imgUrl" });
        await addQueue({ key: "hrefUrl" });
      } catch (error) {
        // console.log(error,44);
      }
      // }
    }, 300);
  }

  async start() {
    connect(redisOption);
    //清空数据
    await this.clearRedis();
    //启动爬虫
    await redisInit({ key: "hrefUrl", url: this.initUrl });
    this.createThead();
    //开始爬虫
  }

  async getAll() {
    connect(redisOption);
    // this.clearRedis();
    // rpop({ key: "listimgUrl" }).then(data => {
    //   console.log(2222, data);
    // });
    // hgetall({ key: "setimgUrl" }).then(data => {
    //   Logger.info(data);
    // });
    // ltrim({key:'mainImg'})
    // ltrim({key:'mainHref'})
    while (true) {
      const a = await rpop({ key: "listhrefUrl" });
      console.log(a);
    }
  }
  end() {
    process.exit();
  }
}
/**
 * 开始爬虫，启动reids
 */
new createTask().start();
// new createTask().getAll();
