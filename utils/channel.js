let request=require("request")
module.exports.get=(id,callback)=>{
  request.get({url:process.env.DARK_DS_API+"/channels/"+id,
  json:true,
  headers:{
    "authorization":process.env.api_token
  }},(err,resp,channel)=>{if(err){throw err};

  if(typeof callback=="function"){
  callback(channel)
}
})
}



module.exports.getMessagesFromChannel=(channel_id,count,callback)=>{
  request.get({url:process.env.DARK_DS_API+"/channels/"+channel_id+"/messages?limit="+count,
  json:true,
  headers:{
    "authorization":process.env.api_token
  }},(d,r,b)=>{  if(typeof callback=="function"){
    callback(b)
  }})

}
module.exports.edit=(id,data,callback)=>{

  request.put({url:process.env.DARK_DS_API+"/channels/"+id,
  headers:{
    "authorization":process.env.api_token
  },
  json:data
},(d,r,b)=>{
  if(typeof callback=="function"){
  callback(b)
}
})
}
module.exports.set=(id,val,data,callback)=>{
  this.get(id,(channel)=>{
    channel[val]=data
    this.edit(id,channel,callback)
  })
}
module.exports.send=(id,data,callback)=>{
  request.post({url:process.env.DARK_DS_API+"/channels/"+id+"/messages",
  headers:{
    "authorization":process.env.api_token
  },
  json:data
},(d,r,b)=>{
  if(typeof callback=="function"){
  callback(b)
}
})
}
