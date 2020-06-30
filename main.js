const dc = require('discord.js')
const fs = require("fs")
const main = new dc.Client();
require("Commands")
const config = JSON.parse(fs.readFileSync("./bot_config.json"))

main.on("ready", function (){
    if (config.name) main.user.setUsername(config.name)
    console.log(`${main.user.tag} logged in`)
})



let cmds = new Map()

function addCommand(cmdName, cmdFunction){
    cmds.set(cmdName, cmdFunction)
}

main.on("message", function (msg){
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


    if (data.startsWithPrefix){
        if (cmds.has(data.command)){
            cmds.get(data.command)(data)
        }
    }


})
main.login(config.token)

export {main, addCommand, cmds}
