const axios = require('axios');
const { connect, set, get} = require('./redis');
const url = 'https://www.xicidaili.com/nn'//国内高匿代理IP
const  htmlParser = require('./htmlParser');
const {redisOption} = require('./config');

async function a(){
  let res = null;
  try {
    res = await axios.get(url);  
  } catch (error) {
    
  }
  if (!res || !res.data) {
    return;
  }
  Html = new htmlParser(res.data);
  const result = Html.getElementsByClassName('odd');
  // const b = new htmlParser(result[0].innerHTML);
  // const b = new htmlParser(result[0].innerHTML).getElementsByTagName('td')[2];
  const ipPools =  result.map((item, index)=>{
    const itemResult =  new htmlParser(item.innerHTML).getElementsByTagName('td');
    return {
      Ip:itemResult[1].innerHTML,
      Port:itemResult[2].innerHTML
    }
  })
  await connect(redisOption)
  await set({key:'IP',value:JSON.stringify(ipPools)})
  console.log(ipPools,4444444);
  process.exit();
  return;
  
}

a();
