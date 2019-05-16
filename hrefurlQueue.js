const { addQueue } = require("./utilParser");
const { connect,subscribe,message } = require("./redis");
const { redisOption } = require("./config");

async function a() {
  connect(redisOption);
  await subscribe({ channel: 'mainhrefUrl' });
  message(function(message){
     addQueue({key:"hrefUrl",tasks:message})
  });
  // while (true) {
  //   await addQueue({ key: "hrefUrl" });
  // }
}
a();