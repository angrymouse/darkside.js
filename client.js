const request = require('request');
process.env.DARK_DS_WS="wss://gateway.discord.gg/?v=6&encoding=json"
process.env.DARK_DS_API="https://discordapp.com/api/v6"
let channelUtil=require("./utils/channel.js")
let canConnect=false
let botUser
let guilds=[]
let users=[]
let preguilds
let channels=[]
let api_token
let isReady=false
const WebSocket = require('ws');
let EventEmmiter=require("events")
let event=new EventEmmiter()
let destroyed=false
let ws=new WebSocket(process.env.DARK_DS_WS)
module.exports.destroy=()=>{ws.close();destroyed=true}
function wsSend(data){
  if(typeof data=="object"){
  ws.send(JSON.stringify(data))
}else{
  ws.send(data)
}
}
ws.onclose = (event) => {
			this.websocket = null;
			this.state = "Disconnected";
			if(event && event.code) {
                console.warn("warn", "WS close: " + event.code);
                var err;
                if(event.code === 4001) {
                    err = new Error("Gateway received invalid OP code");
                } else if(event.code === 4005) {
                    err = new Error("Gateway received invalid message");
                } else if(event.code === 4003) {
                    err = new Error("Not authenticated");
                } else if(event.code === 4004) {
                    err = new Error("Authentication failed");
                } else if(event.code === 4005) {
                    err = new Error("Already authenticated");
                } if(event.code === 4006 || event.code === 4009) {
                    err = new Error("Invalid session");
                } else if(event.code === 4007) {
                    this.sequence = 0;
                    err = new Error("Invalid sequence number");
                } else if(event.code === 4008) {
                    err = new Error("Gateway connection was ratelimited");
                } else if(event.code === 4010) {
                    err = new Error("Invalid shard key");
                }
                if(err) {
                	console.error("error", err);
                }
            }
          }
ws.once('message', function incoming(data) {
setInterval(()=>{
  wsSend(
    {op:1,d:Date.now()}
  )
},JSON.parse(data).d.heartbeat_interval)
canConnect=true
})

let token=null
module.exports.authorize=(givedToken)=>{
  token=givedToken
  if(!canConnect){return setTimeout(()=>{module.exports.authorize(givedToken)},10)}
wsSend({op:2,d:{
  token:givedToken,
  v:6,
  compress:false,
  properties: {
    "$os": process.platform,
    "$browser": "darkside.js",
    "$device": "darkside.js",
    "$referrer": "",
    "$referring_domain": ""
  }
}})
let readydata
ws.on("message",(data)=>{
  wsData=JSON.parse(data);
  if(wsData.t=="READY"){
  readydata=wsData.d
    ws.onclose=()=>{
if(destroyed){return}else{
  ws=new WebSocket(process.env.DARK_DS_WS)
  wsSend=(data)=>{ws.send(JSON.stringify(data))}
  wsSend({op:6,token:token,session_id:wsData.d.session_id,seq:wsData.s})
}
    }

    botUser=wsData.d.user
    botUser.tag=botUser.username+"#"+botUser.discriminator
    if(botUser.bot){
      process.env.api_token="Bot "+token
    }else{
      process.env.api_token=token
    }
    module.exports.botUser=botUser

    preguilds={
      array:wsData.d.guilds,
      size:wsData.d.guilds.length,
      get:(id)=>{wsData.d.guilds.filter(gld=>gld.id==id)}
    }

  }

if(wsData.t=="GUILD_CREATE"){
  if(isReady){
    guilds.array.push(wsData.d)
    event.emit("guild-join",wsData.d)}

  else{
    guilds.push(wsData.d)
    wsData.d.channels.forEach((channel)=>{
    channels.push(channel)
    });
    if(preguilds.size==guilds.length){isReady=true;
      guilds={
        array:guilds,
        size:guilds.length,
        get:(id)=>{guilds.filter(gld=>gld.id==id)}
      }
      channels={
        array:channels,
        size:channels.length,
        get:channelUtil.get,
        edit:channelUtil.edit,
        set:channelUtil.set,
        send:channelUtil.send
      }
      module.exports.guilds=guilds
      module.exports.channels=channels
      event.emit("ready",readydata)
    }
  }
}
if(wsData.t=="MESSAGE_CREATE"){
        event.emit("message",wsData.d)
}
  //console.log(wsData)
})
}

module.exports.event=event
