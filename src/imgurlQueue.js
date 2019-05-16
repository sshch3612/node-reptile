const { addQueue } = require("./utilParser");
const { connect, subscribe, message } = require("./redis");
const { redisOption } = require("./config");

async function a() {
  connect(redisOption);
  await subscribe({ channel: "mainimgUrl" });
  message(function(message) {
    addQueue({ key: "imgUrl", tasks: message });
  });
}
a();
