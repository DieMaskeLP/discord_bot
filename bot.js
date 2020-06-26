const dc = require('discord.js')
const fs = require("fs")
const bot = new dc.Client();

const config = JSON.parse(fs.readFileSync("./bot_config.json"))

bot.on("ready", function (){
    if (config.name) bot.user.setUsername(config.name)
    console.log(`${bot.user.tag} logged in`)
})
bot.on("message", function (msg){
    let data = {
        "author": msg.author,
        "channel": msg.channel,
        "content": msg.content,
        "message": msg,
        "isDM": (msg.channel.type==="dm"),
        "channelName": (msg.channel.type==="dm" ? msg.author.username : msg.channel.name),
        "member": msg.member,
        "user": (msg.channel.type==="dm" ? "null" : msg.member.user),
        "args": msg.content.split(" ").slice(1),
        "startsWithPrefix": (msg.content.startsWith(config.prefix)),
        "command": (msg.content.startsWith(config.prefix) ? msg.content.split(" ")[0].replace(config.prefix, "") : "null")
    }
    data.channel.send(`MessageReceived: By: ${data.author.tag} in channel: ${(data.channelName)} with content: ${data.content}`, {})
})
bot.login(config.token)
