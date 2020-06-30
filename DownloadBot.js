const fs = require("fs")
const dc = require("discord.js")
const yt = require("ytdl-core")
const bot = new dc.Client()

const config = JSON.parse(fs.readFileSync("./bot_config.json"))

bot.login(config.token)



bot.on("message", (msg) => {
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

    let url;
    if (data.startsWithPrefix) {
        if (data.command === "download" || data.command === "dl") {
            if (data.args.length === 1) {
                if (yt.validateURL(data.args[0])) {
                    url = data.args[0]
                    let dl = yt(url)
                    let vidInfo
                    yt.getInfo(url, function (err, info){
                        vidInfo = info
                        console.log(vidInfo.video_id)
                        let path = vidInfo.video_id + ".vid"

                        dl.pipe(fs.createWriteStream(path))
                    })
                    dl.on("end", function (){
                        data.message.reply("Download of video " + vidInfo.title + " complete!")
                    })

                    dl.on("error", function (err){
                        data.message.reply(err)
                    })


                } else data.message.reply("This is not a valid URL")
            } else data.message.reply("Please enter a YouTube URL")
        } else data.message.reply("Available commands:\ndownload            alias: dl")
    }
})