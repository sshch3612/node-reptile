const { fileSave } = require("./utilParser");
const { connect } = require("./redis");
const { redisOption } = require("./config");
async function a() {
  connect(redisOption);
  setInterval(
    async function() {
      await fileSave({ key: "imgUrl" });
    },
    300
  );
}
a();
