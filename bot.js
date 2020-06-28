const dc = require('discord.js')
const fs = require("fs")
const bot = new dc.Client();
let isBotRunning = false
const config = JSON.parse(fs.readFileSync("./bot_config.json"))

bot.on("ready", function (){
    if (config.name) bot.user.setUsername(config.name)
    if (config.activity) bot.user.setPresence({ "game": { name: config.activity }, status: 'online' })
    console.log(`${bot.user.tag} logged in`)
})




bot.on("message", function (msg){

    if (msg.author.bot) return


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
        switch (data.command){
            case "hallo":
                data.channel.send("Moinsen " + data.author.toString())
                break
            case "avatar":
                if (data.args.length===1){
                    data.channel.send(data.message.mentions.users.array()[0].avatarURL())
                } else data.channel.send(data.author.avatarURL())
                break
            case "git":
                data.channel.send("https://github.com/DieMaskeLP/discord_bot")
                break
        }
    }


})



function switchBotState(){
    if (isBotRunning){
        bot.destroy()
    } else {
        bot.login(config.token)
    }
    isBotRunning = !isBotRunning
    return isBotRunning
}
switchBotState()
