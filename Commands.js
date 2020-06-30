const main = require("main")

main.addCommand("hello", function (data){
    data.channel.reply("Moinsen")
})