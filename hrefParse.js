const {pageParse} = require('./utilParser')
const {connect} = require('./redis')
const {redisOption} =  require('./config')
async function a(){
  connect(redisOption)
  while(true){
    await pageParse({ key: "hrefUrl" });
  }
}
a();
