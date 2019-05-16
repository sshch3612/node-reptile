const Redis = require("redis");
let clientRedis = null;
let eventRedis = null;
/**
 * 对深层次递归的
 * */
module.exports.connect = function(option) {
  clientRedis = Redis.createClient(option);
  eventRedis = Redis.createClient(option);
  process.on("exit", code => {
    // console.log(`退出码: ${code}`);
    clientRedis.quit();
  });
};

module.exports.lpush = function(option) {
  return new Promise((resolve, reject) => {
    let value = option.value;
    let key = option.key;
    clientRedis.lpush(key, value, function(err, replies) {
      // console.log(replies, 444);
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.rpop = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.rpop(option.key, function(err, replies) {
      // console.log(replies, 444);
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.hset = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.hset(option.key, option.field, option.value, function(
      err,
      replies
    ) {
      // console.log(replies, 444);
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.hget = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.hget(option.key, option.field, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.hexists = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.hexists(option.key, option.field, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
        reject();
      }
    });
  });
};

module.exports.del = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.del(option.key, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
        reject();
      }
    });
  });
};

module.exports.hgetall = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.hgetall(option.key, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
        reject();
      }
    });
  });
};

module.exports.ltrim = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.ltrim(option.key, 1, 0, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
        reject();
      }
    });
  });
};

module.exports.lrange = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.lrange(option.key, 0, -1, function(err, replies) {
      console.log(333);
      if (err === null) {
        resolve(replies);
      } else {
        reject();
      }
    });
  });
};

module.exports.set = function(option) {
  return new Promise((resolve, reject) => {
    clientRedis.set(option.key, option.value, function(err, replies) {
      // console.log(replies, 444);
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.get = function(option) {
  console.log(option, 733222332233233);
  return new Promise((resolve, reject) => {
    clientRedis.get(option.key, function(err, replies) {
      // console.log(replies, 444);
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.subscribe = function(option) {
  return new Promise((resolve, reject) => {
    eventRedis.subscribe(option.channel, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};

module.exports.message = function(callback) {
  eventRedis.on("message", function(channel, message) {
    callback(message);
  });
};

module.exports.publish = function(option) {
  return new Promise((resolve, reject) => {
    eventRedis.publish(option.channel, option.message, function(err, replies) {
      if (err === null) {
        resolve(replies);
      } else {
      }
    });
  });
};
