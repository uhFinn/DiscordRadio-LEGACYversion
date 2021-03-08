const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs')
const ms = require('ms')
let ytdl = require('ytdl-core');
const ytlist = require('youtube-playlist')
//json stuff//
let dataoldlast = require('./datapackets/old-data/lastsong.json')
let dataoldlikes = require('./datapackets/old-data/likes.json')
let dataalgo = require('./datapackets/algorithmic.json')
let dataevents = require('./datapackets/events/events.json')
let datalikes = require('./datapackets/likes.json')
let databans = require('./datapackets/bans.json')
let cursong = require('./datapackets/cursong.json')
let charts = require('./songdata/charts.json')
let lofi = require('./songdata/lofi.json')
let premcodes = require('./premium/premcodes.json')
let premservers = require('./premium/premservers.json')
//////////////

let suggested = []

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

let lfih = 21

var today = new Date();
var timeh = today.getHours()
var timem = today.getMinutes()

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2000, 1, 1);

let topfortynumgroups = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine","thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine","forty"]
charts = {
    "full": ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine","thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine","forty"]
}
fs.writeFile("./songdata/charts.json", JSON.stringify(charts), (err) => {
    if (err) console.log(err)
});

ytlist("https://www.youtube.com/playlist?list=PLx0sYbCqOb8Q_CLZC2BdBSKEEB59BOPUM", 'url').then(res => {
    let array = res.data.playlist
    let namesong
    let timeseconds
    var i
    for(i = 0; i < array.length; i++){
        (async () => {
            let e = i
            await ytdl.getInfo(array[e], function(err, info) {
                namesong = info.videoDetails.title
                timeseconds = info.videoDetails.lengthSeconds
            });
            charts[topfortynumgroups[e]] = [array[e], timeseconds, namesong]
            fs.writeFile("./songdata/charts.json", JSON.stringify(charts), (err) => {
                if (err) console.log(err)
            });
        })();
    }
})

let integer = 0

let broadcast

client.on("ready", async () => {

    cursong.name = "Loading Discord Radio..."
    cursong.link = "https://discord-nitro.xyz"
    cursong.time = 60
    fs.writeFile("./datapackets/cursong.json", JSON.stringify(cursong), (err) => {
        if (err) console.log(err)
    });

    console.log("Online, Booting Live")

    broadcast = client.voice.createBroadcast();
    //const dispatcher = broadcast.play('audio.mp3');

    setTimeout(function(){
        integer = 0
        let newnum = 1
        console.log(newnum)
        let type = charts.full[newnum]
        console.log(type)
        let songdata = charts[`${type}`]                                         //picks new song
        console.log(songdata)
        let linker = songdata[0]; let secer = songdata[1]; let namer = songdata[2]         //sorts new songs data into vars
        broadcast.play(ytdl(linker))                                                       //updates live cast with new song
        cursong.time = secer; cursong.name = namer; cursong.link = linker                  //files cursong variables with updated new song
        fs.writeFile("./datapackets/cursong.json", JSON.stringify(cursong), (err) => {
            if (err) console.log(err)
        });  
    }, ms("59s"))

})


setInterval(timerup, 1000);
  function timerup( )
  {
    integer = integer + 1
    today = new Date();
    timeh = today.getHours()
    timem = today.getMinutes()
  }

let loopproc = false
setInterval(nextup, 999);
  function nextup( )
  {
    if(loopproc == true) return
    if(integer == cursong.time){
        if(timeh == lfih){
            console.log("LOFI")
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////LOFI
            //old sorting//

            let gdkj = dataalgo.played; dataalgo.played = gdkj + 1 //increases play counter
            dataalgo.list.push(cursong.name) // logs song
            if(!dataalgo[cursong.name]){ 
                dataalgo[cursong.name] = {
                    "status": 1,
                    "played": 1  
                }                     //If no algorithmic data for song, create some
            } else {
                let dkhs = dataalgo[cursong.name].played
                let sjkg = dataalgo[cursong.name].played
                dataalgo[cursong.name].played = dkhs + 1
                dataalgo[cursong.name].status = sjkg - 0.05  //else, write the new data
            }
            if(!dataoldlikes[`${cursong.name}|<>|${cursong.link}`]){
                dataoldlikes[`${cursong.name}|<>|${cursong.link}`] = {
                    "likes": datalikes.likes,
                    "dislikes": datalikes.dislikes
                }                      //If no song like data for song, create some
            } else {
                let gsah = dataoldlikes[`${cursong.name}|<>|${cursong.link}`].likes
                let jaho = dataoldlikes[`${cursong.name}|<>|${cursong.link}`].dislikes
                dataoldlikes[`${cursong.name}|<>|${cursong.link}`].likes = gsah + datalikes.likes
                dataoldlikes[`${cursong.name}|<>|${cursong.link}`].dislikes = jaho + datalikes.dislikes     //else, write the new data
            }

            dataoldlast.songdata.name = cursong.name
            dataoldlast.songdata.link = cursong.link
            dataoldlast.songdata.timeplayed = cursong.time
            dataoldlast.userpoll.likes = 0
            dataoldlast.userpoll.dislikes = 0                         //Updates the last played song variables for command callback

            datalikes.users = []
            datalikes.likes = 0
            datalikes.dislikes = 0                                     //nullifies current like data and resets all dis/like ratios to 0

            fs.writeFile("./datapackets/algorithmic.json", JSON.stringify(dataalgo), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile("./datapackets/likes.json", JSON.stringify(datalikes), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile("./datapackets/old-data/likes.json", JSON.stringify(dataoldlikes), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile("./datapackets/old-data/lastsong.json", JSON.stringify(dataoldlast), (err) => {
                if (err) console.log(err)
            });                                                        //attaches new data to the files associated with the variables (Saves)

            //new sorting//
            let newnum = Math.round(Math.random() * (lofi.full.length - 1))
            console.log(newnum)
            let type = lofi.full[newnum]
            let songdata = lofi["list"][type]   //picks new song
            //duplicatecheck
            if(songdata[2] == dataoldlast.songdata.name){
                newnum = Math.round(Math.random() * (lofi.full.length - 1))
                type = lofi.full[newnum]
                songdata = lofi["list"][type]  
            }
            if(songdata[2] == dataoldlast.songdata.name){
                newnum = Math.round(Math.random() * (lofi.full.length - 1))
                type = lofi.full[newnum]
                songdata = lofi["list"][type]  
            }
            let linker = songdata[0]; let secer = songdata[1]; let namer = songdata[2]         //sorts new songs data into vars
            integer = 0                                                                        //resets upcount to 0
            broadcast.play(ytdl(linker))                                                       //updates live cast with new song
            cursong.time = secer; cursong.name = namer; cursong.link = linker                  //files cursong variables with updated new song
            fs.writeFile("./datapackets/cursong.json", JSON.stringify(cursong), (err) => {
                if (err) console.log(err)
            });
                                                                                        //saves
            return
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////LOFI
        } else {
        //old sorting//

        let gdkj = dataalgo.played; dataalgo.played = gdkj + 1 //increases play counter
        dataalgo.list.push(cursong.name) // logs song
        if(!dataalgo[cursong.name]){ 
            dataalgo[cursong.name] = {
                "status": 1,
                "played": 1  
            }                     //If no algorithmic data for song, create some
        } else {
            let dkhs = dataalgo[cursong.name].played
            let sjkg = dataalgo[cursong.name].played
            dataalgo[cursong.name].played = dkhs + 1
            dataalgo[cursong.name].status = sjkg - 0.05  //else, write the new data
        }
        if(!dataoldlikes[`${cursong.name}|<>|${cursong.link}`]){
            dataoldlikes[`${cursong.name}|<>|${cursong.link}`] = {
                "likes": datalikes.likes,
                "dislikes": datalikes.dislikes
            }                      //If no song like data for song, create some
        } else {
            let gsah = dataoldlikes[`${cursong.name}|<>|${cursong.link}`].likes
            let jaho = dataoldlikes[`${cursong.name}|<>|${cursong.link}`].dislikes
            dataoldlikes[`${cursong.name}|<>|${cursong.link}`].likes = gsah + datalikes.likes
            dataoldlikes[`${cursong.name}|<>|${cursong.link}`].dislikes = jaho + datalikes.dislikes     //else, write the new data
        }
        
        dataoldlast.songdata.name = cursong.name
        dataoldlast.songdata.link = cursong.link
        dataoldlast.songdata.timeplayed = cursong.time
        dataoldlast.userpoll.likes = 0
        dataoldlast.userpoll.dislikes = 0                         //Updates the last played song variables for command callback

        datalikes.users = []
        datalikes.likes = 0
        datalikes.dislikes = 0                                     //nullifies current like data and resets all dis/like ratios to 0

        fs.writeFile("./datapackets/algorithmic.json", JSON.stringify(dataalgo), (err) => {
            if (err) console.log(err)
        });
        fs.writeFile("./datapackets/likes.json", JSON.stringify(datalikes), (err) => {
            if (err) console.log(err)
        });
        fs.writeFile("./datapackets/old-data/likes.json", JSON.stringify(dataoldlikes), (err) => {
            if (err) console.log(err)
        });
        fs.writeFile("./datapackets/old-data/lastsong.json", JSON.stringify(dataoldlast), (err) => {
            if (err) console.log(err)
        });                                                        //attaches new data to the files associated with the variables (Saves)

        //new sorting//
        let newnum = Math.round(Math.random() * charts.full.length)
        console.log(newnum)
        let type = charts.full[newnum]
        let songdata = charts[type]                                         //picks new song
        if(songdata[2] == dataoldlast.songdata.name){
            newnum = Math.round(Math.random() * charts.full.length)
            type = charts.full[newnum]
            songdata = charts["list"][type]  
        }
        if(songdata[2] == dataoldlast.songdata.name){
            newnum = Math.round(Math.random() * charts.full.length)
            type = charts.full[newnum]
            songdata = charts["list"][type]  
        }
        let linker = songdata[0]; let secer = songdata[1]; let namer = songdata[2]         //sorts new songs data into vars
        integer = 0                                                                        //resets upcount to 0
        broadcast.play(ytdl(linker))                                                       //updates live cast with new song
        cursong.time = secer; cursong.name = namer; cursong.link = linker                  //files cursong variables with updated new song
        fs.writeFile("./datapackets/cursong.json", JSON.stringify(cursong), (err) => {
            if (err) console.log(err)
        });
                                                                                      //saves
    }

    let textii = `\`\`\`js\n{\n   "songname": "${cursong.name}",\n   "songlink": "${cursong.link}",\n   "Time(S)": "${cursong.time}"\n}\n\`\`\``
    client.guilds.cache.get('723931758151860226').channels.cache.get('756522986760306769').send(textii)

    }
  }

client.on("message", async message => {

    //database opening

    if(!premservers[message.guild.id]){
        premservers[message.guild.id] = {
         activated: 0, //how many times a premium token has been used in a server
         active: false, //is premium active
         end: 0, //when premium period ends, will be in days since 2000 format
         history: [] //for logging purposes
       };
     }
    fs.writeFile("./premium/premservers.json", JSON.stringify(premservers), (err) => {
       if(err) console.log(err)
     });

    //eodo
    //
    //premium parsing

    if(message.guild.id == "723931758151860226" && (message.author.id == "695664615534755850" || message.author.id == "719996790979428413")){
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        let code = `${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}-${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}-${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}`
        let codelife = `${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}-${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}-${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}-${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}${charset[Math.round(Math.random() * (charset.length - 1))]}`
        if(message.channel.id == "756572534408740924"){ //1month
            let user = message.content.split("|")[0]
            let scenario = message.content.split("|")[1]
            if(scenario == "A"){
                client.users.cache.get(user).send(`**Thank You For Your Purchase!**\nYour one month Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["1month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "B"){
                client.users.cache.get(user).send(`**Thank You For Your Subscription!**\nYour monthly Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["1month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "BAN"){
                client.users.cache.get(user).send(`***Hey There!***\nJust letting you know that you have broken Discord Radios ToS by commiting chargeback fraud via a paypal claim\nDuring purchase you agreed to our legally binding Terms and Conditions stating that you waive your right to chargeback or issue a refund of any kind\nWe as a business have records of this and will use that data against you while fighting the claim\n\nYou have also permanently been banned from accessing any Discord Radio commands, this ban is non-appealable\n\nThank you for your understanding.\nKind Regards,\n-The Discord Radio Team`)
                databans.list.push(message.author.id)
                message.channel.send("Status: DONE=>[NoErr]")
            }
        } else if(message.channel.id == "756572569116606604"){ //3month
            let user = message.content.split("|")[0]
            let scenario = message.content.split("|")[1]
            if(scenario == "A"){
                client.users.cache.get(user).send(`**Thank You For Your Purchase!**\nYour three month Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["3month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "B"){
                client.users.cache.get(user).send(`**Thank You For Your Subscription!**\nYour tri-monthly Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["3month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "BAN"){
                client.users.cache.get(user).send(`***Hey There!***\nJust letting you know that you have broken Discord Radios ToS by commiting chargeback fraud via a paypal claim\nDuring purchase you agreed to our legally binding Terms and Conditions stating that you waive your right to chargeback or issue a refund of any kind\nWe as a business have records of this and will use that data against you while fighting the claim\n\nYou have also permanently been banned from accessing any Discord Radio commands, this ban is non-appealable\n\nThank you for your understanding.\nKind Regards,\n-The Discord Radio Team`)
                databans.list.push(message.author.id)
                message.channel.send("Status: DONE=>[NoErr]")
            }
        } else if(message.channel.id == "756572604835561652"){ //6months
            let user = message.content.split("|")[0]
            let scenario = message.content.split("|")[1]
            if(scenario == "A"){
                client.users.cache.get(user).send(`**Thank You For Your Purchase!**\nYour six month Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["6month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "B"){
                client.users.cache.get(user).send(`**Thank You For Your Subscription!**\nYour 6 monthly Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["6month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "BAN"){
                client.users.cache.get(user).send(`***Hey There!***\nJust letting you know that you have broken Discord Radios ToS by commiting chargeback fraud via a paypal claim\nDuring purchase you agreed to our legally binding Terms and Conditions stating that you waive your right to chargeback or issue a refund of any kind\nWe as a business have records of this and will use that data against you while fighting the claim\n\nYou have also permanently been banned from accessing any Discord Radio commands, this ban is non-appealable\n\nThank you for your understanding.\nKind Regards,\n-The Discord Radio Team`)
                databans.list.push(message.author.id)
                message.channel.send("Status: DONE=>[NoErr]")
            }
        } else if(message.channel.id == "756572636783443999"){ //12months
            let user = message.content.split("|")[0]
            let scenario = message.content.split("|")[1]
            if(scenario == "A"){
                client.users.cache.get(user).send(`**Thank You For Your Purchase!**\nYour one year Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["12month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "B"){
                client.users.cache.get(user).send(`**Thank You For Your Subscription!**\nYour yearly Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${code}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["12month"].push(code)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "BAN"){
                client.users.cache.get(user).send(`***Hey There!***\nJust letting you know that you have broken Discord Radios ToS by commiting chargeback fraud via a paypal claim\nDuring purchase you agreed to our legally binding Terms and Conditions stating that you waive your right to chargeback or issue a refund of any kind\nWe as a business have records of this and will use that data against you while fighting the claim\n\nYou have also permanently been banned from accessing any Discord Radio commands, this ban is non-appealable\n\nThank you for your understanding.\nKind Regards,\n-The Discord Radio Team`)
                databans.list.push(message.author.id)
                message.channel.send("Status: DONE=>[NoErr]")
            }
        } else if(message.channel.id == "756572669608198155"){ //lifetime
            let user = message.content.split("|")[0]
            let scenario = message.content.split("|")[1]
            if(scenario == "A"){
                client.users.cache.get(user).send(`**Thank You For Your Purchase!**\nYour lifetime Discord Radio **Premium** token was successfully processed\nThe command below should be used in a server of your choice once this command has been used in that server it can not be used in any other server\nWhen the command is used only the server you use it in will receive the premium perks, Choose Wisely!\n\n**>premium activate ${codelife}**\n\nThank you for supporting discord radio,\nEnjoy!`)
                premcodes["lifetime"].push(codelife)
                message.channel.send("Status: DONE=>[NoErr]")
            } else if(scenario == "BAN"){
                client.users.cache.get(user).send(`***Hey There!***\nJust letting you know that you have broken Discord Radios ToS by commiting chargeback fraud via a paypal claim\nDuring purchase you agreed to our legally binding Terms and Conditions stating that you waive your right to chargeback or issue a refund of any kind\nWe as a business have records of this and will use that data against you while fighting the claim\n\nYou have also permanently been banned from accessing any Discord Radio commands, this ban is non-appealable\n\nThank you for your understanding.\nKind Regards,\n-The Discord Radio Team`)
                databans.list.push(message.author.id)
                message.channel.send("Status: DONE=>[NoErr]")
            }
        }
        fs.writeFile("./premium/premcodes.json", JSON.stringify(premcodes), (err) => {
            if (err) console.log(err)
        });
        fs.writeFile("./datapackets/bans.json", JSON.stringify(databans), (err) => {
            if (err) console.log(err)
        });
    }

    //eopp

    let prefix = ">"
    const users = client.users.size
    const servers = client.guilds.size
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "play" || command == "join" || command == "p" || command == "stream"){
        let connection = await message.member.voice.channel.join();
        connection.play(broadcast)
        message.react('👍')
    }

    if(command == "like" || command == "l"){
        let failemb = new Discord.MessageEmbed()
            .setTitle("❌ Your Vote Was Not Counted ❌")
            .setDescription(`You have already voted on the current song, please wait till the next song to vote again!`)
        if(datalikes.users.includes(message.author.id)) return message.channel.send(failemb)
        let curlikes = datalikes.likes
        datalikes.likes = curlikes + 1
        datalikes.users.push(message.author.id)
        fs.writeFile("./datapackets/likes.json", JSON.stringify(datalikes), (err) => {
            if (err) console.log(err)
        });

        let emb = new Discord.MessageEmbed()
            .setTitle("✅ Your Vote Has Been Counted ✅")
            .setDescription(`You have liked the current song,\n\n**Likes:** ${datalikes.likes}\n**Dislikes:** ${datalikes.dislikes}`)
            .setFooter("Your votes help the AI better determine what songs to play in the future!")

        message.channel.send(emb)

        let textii = `\`\`\`js\n{\n   "Action": "like",\n   "User": "${message.author.username}|${message.author.id}",\n   "SongMeta": "${cursong.name}[<>]${cursong.link}"\n}\n\`\`\``
        client.guilds.cache.get('723931758151860226').channels.cache.get('756523081358508165').send(textii)
    }

    if(command == "dislike" || command == "d"){
        let failemb = new Discord.MessageEmbed()
            .setTitle("❌ Your Vote Was Not Counted ❌")
            .setDescription(`You have already voted on the current song, please wait till the next song to vote again!`)
        if(datalikes.users.includes(message.author.id)) return message.channel.send(failemb)
        let curlikes = datalikes.dislikes
        datalikes.dislikes = curlikes + 1
        datalikes.users.push(message.author.id)
        fs.writeFile("./datapackets/likes.json", JSON.stringify(datalikes), (err) => {
            if (err) console.log(err)
        });

        let emb = new Discord.MessageEmbed()
            .setTitle("✅ Your Vote Has Been Counted ✅")
            .setDescription(`You have disliked the current song,\n\n**Likes:** ${datalikes.likes}\n**Dislikes:** ${datalikes.dislikes}`)
            .setFooter("Your votes help the AI better determine what songs to play in the future!")

        message.channel.send(emb)

        let textii = `\`\`\`js\n{\n   "Action": "dislike",\n   "User": "${message.author.username}|${message.author.id}",\n   "SongMeta": "${cursong.name}[<>]${cursong.link}"\n}\n\`\`\``
        client.guilds.cache.get('723931758151860226').channels.cache.get('756523081358508165').send(textii)
    }

    if(command == "likes"){
        let llikes = 0
        let ldislikes = 0
        if(dataoldlikes[`${cursong.name}|<>|${cursong}`]) llikes = dataoldlikes[`${cursong.name}|<>|${cursong}`].likes
        if(dataoldlikes[`${cursong.name}|<>|${cursong}`]) ldislikes = dataoldlikes[`${cursong.name}|<>|${cursong}`].dislikes
        let emb = new Discord.MessageEmbed()
            .setTitle(`This songs like status`)
            .addField(`Current Like Status`, `**Likes:** ${datalikes.likes}\n**Dislikes:** ${datalikes.dislikes}`)
            .addField(`Lifetime Like Status`, `**Likes:** ${llikes}\n**Dislikes:** ${ldislikes}`)

        message.channel.send(emb)
    }
    
    if(command == "mod"){
        let modlist = ["719996790979428413"]
        if(!modlist.includes(message.author.id)) return message.channel.send("Err:No Access")

        if(args[0] == "skip"){
            integer = (cursong.time - 1)
            message.react('🇩')
            message.react('🇴')
            message.react('🇳')
            message.react('🇪')

            let textii = `\`\`\`diff\n+ mod skip : ${message.author.username}|<>|${message.author.id}\n\`\`\``
            client.guilds.cache.get('723931758151860226').channels.cache.get('756540748903743608').send(textii)
        }
    }

    if(command == "playing"){
        //timestamp things

        let end5 = cursong.time
        let end4 = end5 / 60
        let end3 = Math.floor(end4)
        let end2 = end5 - (end3 * 60)
        let end2st = `${end2}`
        if(end2st.length == 1) end2 = `0${end2}`
        let end = `${end3}:${end2}`
        
        let current5 = integer
        let current4 = current5 / 60
        let current3 = Math.floor(current4)
        let current2 = current5 - (current3 * 60)
        let cur2st = `${current2}`
        if(cur2st.length == 1) current2 = `0${current2}`
        let current = `${current3}:${current2}`

        let timestamp = `${current}/${end}`

        let ghajh = 100 / cursong.time
        let doneper = Math.round(ghajh * integer)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }


        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}==`
            if(i == out - 1){
                stringie = `${stringie}**`
            }
        }
        var b
        for(b = 0; b < remain; b++){
            stringie = `${stringie}––`
        }

        //
        let emb = new Discord.MessageEmbed()
            .setTitle(cursong.name)
            .setColor("#ec96f2")
            .setDescription(`${current} [${stringie}] ${end}\n**>**> [**[LINK]**](${cursong.link}) <**<**`)
            .setTimestamp()
            .setFooter("Discord Radio")

        message.channel.send(emb)

    }

    if(command == "leave"){

    }

    if(command == "premium"){
        let arzil
        let aruno
        if(args[0]) arzil = args[0].toLowerCase()
        if(args[1]) aruno = args[1].toLowerCase()

        if(!args[0]){
            let emb = new Discord.MessageEmbed()
                .setTitle("**Premium** Commands")
                .setColor("#ba5dfc")
                .addField("`>premium info`", "Gives you info regarding all Discord Radio premium features")
                .addField("`>premium help`", "Gives direct instructions on how to use your new premium commands")
                .addField("`>premium buy`", "Returns a unique link allowing you to purchase Discord Radio premium")
                .addField("`>premium activate [code]`", "Activates Discord Radio premium in the server the command is used in")
                .setFooter("Standard Discord Radio is not hindered by not having premium, Premium is solely a way to support the development and hosting of the bot while receiving some unique features.\nThank You for your consideration!")

            message.channel.send(emb)
        } else {
            if(arzil == "info"){
                let emb = new Discord.MessageEmbed()
                    .setTitle("**Premium** Features")
                    .setColor("#ba5dfc")
                    .setDescription("Discord Radio Premium allows users to unlock some unique and helpful features while supporting the creation and maintenance of the bot, All purchases are massively appreciated!")
                    .addField("**24/7 In A Channel**", "Usually after a few hours the bot will disconnect from a voice channel, this is to preserve ram and keep the bot running smoothly. With this feature you can set a channel for the bot to permanently live in until you change it, this will also lock the >play command until unset")
                    .addField("**Custom Prefix**", "By default Discord Radio's prefix is **>** with this feature you can change that prefix to whatever you want!")
                    .addField("**Radio Notifications Channel**", "Whenever a new discord radio song starts a message will get sent into a channel of your choice letting people know what song is playing and when certain radio events occur!")
            } else if(arzil == "buy"){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Purchase Discord Radio **Premium**")
                    .setColor("#ba5dfc")
                    .setDescription("Premium features are waiting... Purchase them here!\nhttps://discord-radio.tebex.io/")
                    .setFooter("All premium purchases are non refundable and you agree to a non-chargeback agreement on checkout")

                message.channel.send(emb)
            } else if(arzil == "activate"){
                if(!args[1]) return message.channel.send("***Error!***\nPlease specify a code to activate, EG: **>premium activate XXXXX-XXXXX-XXXXX**\nIf you need a code type: **>premium buy**")
                if(premcodes["1month"].includes(args[1])){
                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    if(premservers[message.guild.id].end >= diffDays){
                        premservers[message.guild.id].end = premservers[message.guild.id].end + 30
                        message.reply("**Congratulations!**\nWe successfully activated your 1 month Discord Radio premium token!\nAs this server already had discord radio premium we've credited the extra days on for you!\n**Enjoy!**")
                    } else if(premservers[message.guild.id].end < diffDays){
                        premservers[message.guild.id].end = (diffDays + 30)
                        message.reply("**Congratulations!**\nWe successfully activated your 1 month Discord Radio premium token!\nTo get started make sure to check out `>premium help` to learn how to use your new commands\nYou can also check how many days of premium you have left with `>premium status`\n**Enjoy!**")
                    }
                    premservers[message.guild.id].active = true
                    premservers[message.guild.id].activated = premservers[message.guild.id].activated + 1
                    premservers[message.guild.id].history.push(`[+30 Days | ${message.author.username}|<>|${message.author.id}]`)
                    premcodes["1month"].remove(args[1])
                    let textii = `${message.author.username}|<>|${message.author.id}\nRedeemed **1 Month** Premium Token`
                    client.guilds.cache.get('723931758151860226').channels.cache.get('756796412343091250').send(textii)

                } else if(premcodes["3month"].includes(args[1])){

                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    if(premservers[message.guild.id].end >= diffDays){
                        premservers[message.guild.id].end = premservers[message.guild.id].end + 90
                        message.reply("**Congratulations!**\nWe successfully activated your 3 month Discord Radio premium token!\nAs this server already had discord radio premium we've credited the extra days on for you!\n**Enjoy!**")
                    } else if(premservers[message.guild.id].end < diffDays){
                        premservers[message.guild.id].end = (diffDays + 90)
                        message.reply("**Congratulations!**\nWe successfully activated your 3 month Discord Radio premium token!\nTo get started make sure to check out `>premium help` to learn how to use your new commands\nYou can also check how many days of premium you have left with `>premium status`\n**Enjoy!**")
                    }
                    premservers[message.guild.id].active = true
                    premservers[message.guild.id].activated = premservers[message.guild.id].activated + 1
                    premservers[message.guild.id].history.push(`[+90 Days | ${message.author.username}|<>|${message.author.id}]`)
                    premcodes["3month"].remove(args[1])
                    let textii = `${message.author.username}|<>|${message.author.id}\nRedeemed **3 Month** Premium Token`
                    client.guilds.cache.get('723931758151860226').channels.cache.get('756796412343091250').send(textii)

                } else if(premcodes["6month"].includes(args[1])){

                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    if(premservers[message.guild.id].end >= diffDays){
                        premservers[message.guild.id].end = premservers[message.guild.id].end + 180
                        message.reply("**Congratulations!**\nWe successfully activated your 6 month Discord Radio premium token!\nAs this server already had discord radio premium we've credited the extra days on for you!\n**Enjoy!**")
                    } else if(premservers[message.guild.id].end < diffDays){
                        premservers[message.guild.id].end = (diffDays + 180)
                        message.reply("**Congratulations!**\nWe successfully activated your 6 month Discord Radio premium token!\nTo get started make sure to check out `>premium help` to learn how to use your new commands\nYou can also check how many days of premium you have left with `>premium status`\n**Enjoy!**")
                    }
                    premservers[message.guild.id].active = true
                    premservers[message.guild.id].activated = premservers[message.guild.id].activated + 1
                    premservers[message.guild.id].history.push(`[+180 Days | ${message.author.username}|<>|${message.author.id}]`)
                    premcodes["6month"].remove(args[1])
                    let textii = `${message.author.username}|<>|${message.author.id}\nRedeemed **6 Month** Premium Token`
                    client.guilds.cache.get('723931758151860226').channels.cache.get('756796412343091250').send(textii)

                } else if(premcodes["12month"].includes(args[1])){

                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    if(premservers[message.guild.id].end >= diffDays){
                        premservers[message.guild.id].end = premservers[message.guild.id].end + 360
                        message.reply("**Congratulations!**\nWe successfully activated your 1 year Discord Radio premium token!\nAs this server already had discord radio premium we've credited the extra days on for you!\n**Enjoy!**")
                    } else if(premservers[message.guild.id].end < diffDays){
                        premservers[message.guild.id].end = (diffDays + 360)
                        message.reply("**Congratulations!**\nWe successfully activated your 1 year Discord Radio premium token!\nTo get started make sure to check out `>premium help` to learn how to use your new commands\nYou can also check how many days of premium you have left with `>premium status`\n**Enjoy!**")
                    }
                    premservers[message.guild.id].active = true
                    premservers[message.guild.id].activated = premservers[message.guild.id].activated + 1
                    premservers[message.guild.id].history.push(`[+360 Days | ${message.author.username}|<>|${message.author.id}]`)
                    premcodes["12month"].remove(args[1])
                    let textii = `${message.author.username}|<>|${message.author.id}\nRedeemed **1 Year** Premium Token`
                    client.guilds.cache.get('723931758151860226').channels.cache.get('756796412343091250').send(textii)

                } else if(premcodes["lifetime"].includes(args[1])){

                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    if(premservers[message.guild.id].end >= diffDays){
                        premservers[message.guild.id].end = premservers[message.guild.id].end + 99999999
                        message.reply("**Congratulations!**\nWe successfully activated your lifetime Discord Radio premium token!\nAs this server already had discord radio premium we've credited the extra days on for you!\n**Enjoy!**")
                    } else if(premservers[message.guild.id].end < diffDays){
                        premservers[message.guild.id].end = (diffDays + 99999999)
                        message.reply("**Congratulations!**\nWe successfully activated your lifetime Discord Radio premium token!\nTo get started make sure to check out `>premium help` to learn how to use your new commands\nYou can also check how many days of premium you have left with `>premium status`\n**Enjoy!**")
                    }
                    premservers[message.guild.id].active = true
                    premservers[message.guild.id].activated = premservers[message.guild.id].activated + 1
                    premservers[message.guild.id].history.push(`[+99999999 Days | ${message.author.username}|<>|${message.author.id}]`)
                    premcodes["lifetime"].remove(args[1])
                    let textii = `${message.author.username}|<>|${message.author.id}\nRedeemed **lifetime** Premium Token`
                    client.guilds.cache.get('723931758151860226').channels.cache.get('756796412343091250').send(textii)

                } else return message.channel.send("***Oops!***\nThat code is invalid, Codes are case sensitive so make sure to correct your capitalization\nIf you need a code type: **>premium buy**")
                fs.writeFile("./premium/premservers.json", JSON.stringify(premservers), (err) => {
                    if(err) console.log(err)
                });
                fs.writeFile("./premium/premcodes.json", JSON.stringify(premcodes), (err) => {
                    if(err) console.log(err)
                });
            } else if(arzil == "status"){
                if(premservers[message.guild.id].active == false){
                    let emb = new Discord.MessageEmbed()
                        .setTitle("Discord Radio Premium")
                        .setColor("#f54842")
                        .setDescription(`**Active:** No\n**Days Remaining:** 0`)
                        .setTimestamp()
                        .setFooter("Use >premium buy to purchase premium")

                    message.channel.send(emb)
                } else {
                    let secondDate = new Date(today.getFullYear(), (today.getMonth() + 1), today.getDate());
                    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    let end = premservers[message.guild.id].end
                    let days = end - diffDays
                    if(days > 100000) days = "__lifetime__"

                    let emb = new Discord.MessageEmbed()
                        .setTitle("Discord Radio Premium")
                        .setColor("#aef241")
                        .setDescription(`**Active:** Yes\n**Days Remaining:** ${days}`)
                        .setTimestamp()
                        .setFooter("Discord Radio Premium")

                    message.channel.send(emb)
                }
            } else {
                let emb = new Discord.MessageEmbed()
                    .setTitle("**Premium** Commands")
                    .setColor("#ba5dfc")
                    .addField("`>premium info`", "Gives you info regarding all Discord Radio premium features")
                    .addField("`>premium help`", "Gives direct instructions on how to use your new premium commands")
                    .addField("`>premium buy`", "Returns a unique link allowing you to purchase Discord Radio premium")
                    .addField("`>premium activate [code]`", "Activates Discord Radio premium in the server the command is used in")
                    .setFooter("Standard Discord Radio is not hindered by not having premium, Premium is solely a way to support the development and hosting of the bot while receiving some unique features.\nThank You for your consideration!")

                message.channel.send(emb)
            }
        }
    }

    if(command == "save" || command == "favorite" || command == "favourite"){

    }

    if(command == "saved" || command == "favorites" || command == "favourites"){

    }

    if(command == "invite"){
        let emb = new Discord.MessageEmbed()
            .setTitle("Invite Discord Radio To Your Server!")
            .setColor('RANDOM')
            .setDescription("[Discord Radio, The New Way To Experience Music](https://discord.com/oauth2/authorize?client_id=752606263396794398&scope=bot&permissions=83221953) \n\nDiscord radio is the new unique way to enjoy and listen to music on discord, Hands free cloud based broadcasting across all discord servers through one powerfull AI system that learns what you love listening to,\nIts the perfect solution for your discord server!")
            .setImage("https://images-ext-1.discordapp.net/external/HxQPwrwqWqhustolzxC0dblt-gjVdKi36x6a7csUjPE/https/discord.com/assets/ee7c382d9257652a88c8f7b7f22a994d.png?width=960&height=504")

        message.channel.send(emb)
    }

    if(command == "feedback" || command == "suggest"){
        if(suggested.includes(message.author.id)) return message.reply("You have already submitted a suggestion/feedback recently, Try again in a day or two\n*(This is to reduce spam so we can give each suggestion/feedback the time it deserves to be reviewed)*")
        let suggestion = args.slice(0).join(" ");
        client.guilds.cache.get('723931758151860226').channels.cache.get('756805149435101217').send(`\`\`\`diff\n- ${message.author.tag} |<>| ${message.author.id} |<>| ${command}\`\`\`\n\n${suggestion}`)
        suggested.push(message.author.id)

        message.channel.send("***Thanks!***\nYour suggestion/feedback was successfully sent to our developers and we will review it shortly\nYour helping make Discord Radio better!")
    }

    if(command === "eval"){
  
        function clean(text) {
         if (typeof(text) === "string")
           return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
         else
             return text;
       }  
         let arg = message.content.split(" ").slice(1);
           if(message.author.id !== "719996790979428413") return
           try {
             let code = arg.join(" ");
             let evaled = eval(code);
             if (typeof evaled !== "string")
               evaled = require("util").inspect(evaled);
             message.channel.send(clean(evaled), {code:"xl"});
             console.log(`Done: ${code} return: good`)
           } catch (err) {
             message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
             console.log("error with eval")
           }
          
       
    }

})

client.login('TOKEN')