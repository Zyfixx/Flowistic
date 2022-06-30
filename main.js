const app = require('whatsapp-web.js')
const qrc = require('qrcode-terminal')
const fs = require('fs')
const path = './session.json'
const db = require('quick.db');
const cntr = require(`country-code-lookup`)
const ms = require('ms')
const request = require(`request`)
const moment = require('moment')
const momentz = require('moment-timezone');
const vm = require('vm')
const psd = require('psd.js')
const agpsd = require('ag-psd')
const wwebs = require('@deathabyss/wwebjs-sender')
const ttt = require(`tictactoe_model`)
require(`dotenv`).config()
let sessionCfg;
if (fs.existsSync(path)){
    sessionCfg = require(path)
}

const client = new app.Client({
    authStrategy: new app.LocalAuth(),
    ffmpegPath: './apps/ffmpeg.exe'
});

commands = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    commands.set(command.name, command);
}

const get = function(command_name) {
    var data = fs.readFileSync(`./commands/${command_name}.js`)
    return data
}

const pagiTimeout = new Set();

const timezones = ['Asia/Jakarta']

client.on('qr', (qr) => {
    qrc.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Bot is ready!');
    a()
});

client.on('message', async message => {
    const chat = await message.getChat();
    const sender = await message.getContact();
    const prefix = db.get(`group_${message.from}_prefix`) || `!`;
    const args = message.body.slice(prefix.length).toLowerCase().split(/ +/);
    const cArgs = message.body.slice(prefix.length).split(/ +/);

    moment.tz.setDefault("Asia/Jakarta")
    moment.locale("id")
    console.log(`${message.from} | ${message.body}`)

    if(chat.isGroup == false) {
        if(!db.get(`user_${message.from}_warned`)) {
            client.sendMessage(message.from, `Please add me to a group since I don't work in Private Chat!`) 
            db.set(`user_${message.from}_warned`, true)  
        }
    }

    xp(message)
  function xp(message) {
    db.add(`guild_${message.from}_xp_${message.author}`, 1);
    const mAuthor = message.author
    let filter = mAuthor.slice(0, -5)
    let xp = db.get(`guild_${message.from}_xp_${message.author}`)
    let lvl = db.get(`guild_${message.from}_level_${message.author}`) || db.set(`guild_${message.from}_level_${message.author}`,1);
    let level = Math.floor(Math.pow(lvl / 0.1, 2));
    if (xp > level) {
        let newLevel = db.set(`guild_${message.from}_level_${message.author}`,lvl + 1);
        client.sendMessage(message.from, `:tada: @${db.get(`username_${filter}`)}, You just advanced to level ${newLevel}!`);
    }
  } 
  if(chat.isGroup == true) {
    if(message.body.startsWith(`${prefix}ping`)) {
        message.reply(`Pong`)
    };
    if(message.body.startsWith(`${prefix}tosticker`)) {
        commands.get('tosticker').execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}osuprofile`)) {
        commands.get('osuprofile').execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}xp`)) {
        //console.log(db.get(`guild_${message.from}_xp_${message.author}`))
        message.reply(`${db.get(`guild_${message.from}_xp_${message.author}`)}`)
    }
    if(message.body.startsWith(`${prefix}rank`)) {
        if(message.author) {
            const mAuthor = message.author
            let filter = mAuthor.slice(0, -5)
            let user = db.get(`username_${filter}`)
    

            let level = db.get(`guild_${message.from}_level_${message.author}`) || 0;
            let exp = db.get(`guild_${message.from}_xp_${message.author}`) || 0;
            let neededXP = Math.floor(Math.pow(level / 0.1, 2));
  
            let every = db.all().filter(i => i.ID.startsWith(`guild_${message.from}`)).sort((a, b) => b.data - a.data);
            let rank = every.map(x => x.ID).indexOf(`us_xp_${message.author}`) + 1;
            console.log(db.all())
            client.sendMessage(message.from,
`User: ${user || message.author}
Level: ${level}
XP: ${exp}
Needed XP to level up: ${neededXP}
Rank: ${rank}`)
        }
    }
    if(message.body.startsWith(`${prefix}resetrank`)){
        db.delete(`guild_${message.from}_level_${message.author}`)
        db.delete(`guild_${message.from}_xp_${message.author}`)
        message.reply('Sumdh')
    }
    if(message.body.startsWith(`${prefix}username`)) {
        if(args[1] == 'set') {
            if(args[2]) {
                if(message.author) {
                    const cArgs = message.body.slice(prefix.length).split(/ +/);
                    const username = cArgs.slice(2).join(' ');
                    const mAuthor = message.author
                    let filter = mAuthor.slice(0, -5)
                    db.set(`username_${filter}`,  `${username}`)
                    client.sendMessage(message.from, `Username set to: ${username}`)
                }
                
            }
            if(!args[2]) {
                message.reply(`Please provide a username!`)
            }
        }
        if(args[1] == 'del' || args[1] == 'remove' || args[1] == 'delete' || args[1] == 'rem') {
                    const mAuthor = message.author
                    let filter = mAuthor.slice(0, -5)
                    const username = db.get(`username_${filter}`)
            db.delete(`username_${message.author}`)
            client.sendMessage(message.from, `Username "${username}" deleted`)
        }
        if(!args[1]) {
            message.reply(`What do you want to do with your username? (Available Options: ['set', 'del'])`)
        }
    }
    if(message.body.startsWith(`${prefix}bind`)) {
        const cArgs = message.body.slice(prefix.length).split(/ +/);
        const username = cArgs.slice(1).join(' ').toLowerCase();
        if(args[1]) {
            fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${username}`).then(res => res.json())
            .then(output => {
            const user = output[0];
            if(!user.accuracy) {
                message.reply("User not found")
            } else {
            const lUsername = user.username.toLowerCase()
            if(db.get(`osuprofile_${message.author}`) != lUsername || !db.get(`osuprofile_${message.author}`)) {
            db.set(`osuprofile_${message.author}`, user.username)
            client.sendMessage(message.from, `Your account has been bound to ${user.username}`)
                }
            else if(db.get(`osuprofile_${message.author}`) == lUsername) {
            message.reply(`Your account has already been bound to ${user.username}!`)
                }
            }
        })
            
        }
        if(!args[1]) {
            message.reply(message.from, `Please enter your osu! username!`)
        }
    }
    if(message.body.startsWith(`${prefix}unbind`)) {
        db.delete(`osuprofile_${message.author}`)
        client.sendMessage(message.from, `Your osu! profile has been unbound`)
    }
    if(message.body.startsWith(`${prefix}everyone`)) {
        //const timeout = 3600000;
        //const cooldown = null //await db.fetch(`cooldown_everyone_${message.from}`);
        //const chat = await message.getChat();
        //let text = "";
        //let mentions = [];
        //for(let participant of chat.participants) {
        //    const contact = await client.getContactById(participant.id._serialized);
        //    mentions.push(contact);
        //    text += `@${participant.id.user} `;
        //    if(participant.id._serialized === message.author && !participant.isAdmin) {
        //        client.sendMessage(message.from, `The command can only be used by group admins.`)
        //    }
        //    if(participant.id._serialized === message.author && participant.isAdmin) {
        //    if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
        //        const time = ms(timeout - (Date.now() - cooldown));
        //        client.sendMessage(message.from, `Sorry you must wait ${time} before using this command again!`);
        //    } else {
        //    await chat.sendMessage(text, { mentions });
        //    db.set(`cooldown_everyone_${message.from}`, Date.now());
        //    }
        //}
        //}
        const chat = await message.getChat();
        
        let text = "";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
    if(message.body.startsWith(`${prefix}gamemode`)) {
        const cArgs = args.slice(1).join(' ')
        if(cArgs == 'm' || cArgs == `mania`) {
            db.set(`user_${message.author}_dgm`, `mania`)
            message.reply(`Your default gamemode is now set to mania`)
        }
        if(!cArgs || cArgs == 's' || cArgs == `std` || cArgs == 'standard') {
            db.set(`user_${message.author}_dgm`, `standard`)
            message.reply(`Your default gamemode is now set to standard`)
        }
        if(cArgs == 'c' || cArgs == `ctb` || cArgs == `catch the beat` || cArgs == 'catch') {
            db.set(`user_${message.author}_dgm`, `catch`)
            message.reply(`Your default gamemode is now set to catch the beat`)
        }
        if(cArgs == 't' || cArgs == `taiko`) {
            db.set(`user_${message.author}_dgm`, `taiko`)
            message.reply(`Your default gamemode is now set to taiko`)
        }
    }
    if(message.body.startsWith(`${prefix}rs`)) {
        commands.get('rs').execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}osupfp`)) {
        const username = args.slice(1).join(' ') || db.get(`osuprofile_${message.author}`)
        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
              request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
            })
          }
        fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${username}`).then(res => res.json())
        .then(async output => {
            const user = output[0]
            const userId = output[0].user_id
            if(!userId) {
                message.reply("User not found")
            } else {
            const aurl = `https://a.ppy.sh/${userId}`
            const path = `./osupfp.png`
            const media = await app.MessageMedia.fromUrl(aurl, {unsafeMime: true})
            const options = {
                url: aurl,
                dest: path
            }
            client.sendMessage(message.from, media)
        }
        })
    }
    if(message.body.startsWith(`${prefix}button`)){
        commands.get(`buttontest`).execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}list`)){
        commands.get(`listtest`).execute(message, args, client)
    }
    if(message.type === 'list_response'){
        const contact = await message.getContact()
        client.sendMessage(message.from, `@${contact.id.user} chose ${message.body}`, {mentions: [contact]})
        if(db.get(`vote_${message.from}_contact_${contact.id.user}`) != message.body || !db.has(`vote_${message.from}_contact_${contact.id.user}`)){
            db.set(`vote_${message.from}_contact_${contact.id.user}`, message.body)
            db.add(`voteOpt_${message.from}_${message.body}`, 1)
        }
    }
    if(message.body.startsWith(`${prefix}result`)){
        const list = await message.getQuotedMessage()
        const listOpt = ["Nanda", "Ipan"]

        client.sendMessage(message.from, `Nanda: ${db.get(`${message.from}_Nanda`)}\nIpan: ${db.get(`${message.from}_Ipan`)}`)

    }
    if(message.body.startsWith(`${prefix}resetlist`)){
        const votes = db.all().filter(i => i.ID.startsWith(`voteOpt_${message.from}_`))
        client.sendMessage(message.from, `List data deleted. End of result:
        Nanda: ${db.get(`voteOpt_${message.from}_Nanda`)}\nIpan: ${db.get(`voteOpt_${message.from}_Ipan`)}`)
        votes.forEach(i => db.delete(i))
    }
    if(message.body.startsWith(`${prefix}ai`)){
        commands.get(`ai`).execute(message, cArgs, client)
    }
    if(message.body.startsWith(`${prefix}odaily`)){
        commands.get(`odaily`).execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}tictactoe`)){
        
        commands.get(`tictactoe`).execute(message, args, client)
    }
    //if(db.get(`ttt_inGame_${message.author}`)){
    //    const p1 = message.author
    //    const p2 = db.get(`ttt_enemy_${p1}`)
    //    const table = new Board(db.get(`ttt_table_${p1.slice(0,-5) + p2.slice(0,-5)}`))
    //    if(isNaN(message.body)) return message.reply(`Invalid Number!`)
    //    else{
    //        if(db.get(`ttt_firstPlayer_${message.author}`) == message.author){
    //            if(table.currentMark() == 'X'){
    //            table.move(message.body, 'X')
    //            client.sendMessage(message.from, `${table[0]} | ${table[1]} | ${table[2]}\n${table[3]} | ${table[4]} | ${table[5]}\n${table[6]} | ${table[7]} | ${table[8]}`)
    //            }
    //            else{ message.reply(`Not your turn!`) }
    //        }
    //        else{
    //            if(table.currentMark() == 'O'){
    //            table.move(message.body, 'O')
    //            client.sendMessage(message.from, `${table[0]} | ${table[1]} | ${table[2]}\n${table[3]} | ${table[4]} | ${table[5]}\n${table[6]} | ${table[7]} | ${table[8]}`)
    //            }
    //            else{ message.reply(`Not your turn!`) }
    //        }
    //    }
    //}
    if(message.body.startsWith(`${prefix}tttend`)){
        db.delete(`ttt_inGame_${message.author}`)
    }
    if(db.get(`inGame_${message.author}`) == true){
        function convertToCoordinates(number) {
            var col, row;
            col = Number.parseInt((number - 1) / 3);
            row = Number.parseInt((number) % 3 || 3) - 1;
            return [row, col];
        }
        function checkWinner(){
            if(table[0] == table[1] && table[1] == table[2] && table[0] != null){
                return true;
            }
            else if(table[3] == table[4] && table[4] == table[5] && table[3] != null){
                return true;
            }
            else if(table[6] == table[7] && table[7] == table[8] && table[6] != null){
                return true;
            }
            else if(table[0] == table[3] && table[3] == table[6] && table[0] != null){
                return true;
            }
            else if(table[1] == table[4] && table[4] == table[7] && table[1] != null){
                return true;
            }
            else if(table[2] == table[5] && table[5] == table[8] && table[2] != null){
                return true;
            }
            else if(table[0] == table[4] && table[4] == table[8] && table[0] != null){
                return true;
            }
            else if(table[2] == table[4] && table[4] == table[6] && table[2] != null){
                return true;
            }
            else{
                return false;
            }
        }
        const p1 = message.author
        const p2 = db.get(`enemy_${p1}`)
        const table = db.get(`table_${p1 + p2}`)
        while(checkWinner() == false){
            var move = message.body
            if(isNaN(move)) {
                message.reply(`Invalid Number!`)
                db.delete(`inGame_${p1}`)
                db.delete(`inGame_${p2}`)
                db.delete(`turn_${p1 + p2}`)
                db.delete(`tictactoe_${p1}`)
                db.delete(`tictactoe_${p2}`)
                db.delete(`enemy_${p1}`)
                db.delete(`enemy_${p2}`)
                db.delete(`table_${p1 + p2}`)
                message.reply(`endenednednednd`)
            }
            else if(db.get(`tictactoe_${message.author}`) == db.get(`turn_${p1 + p2}`)){
                console.log(`move is a number`)
                db.set(`turn_${p1 + p2}`, db.get(`turn_${p1 + p2}`) == 'X' ? 'O' : 'X')
                table[move] = db.get(`tictactoe_${message.author}`)
                db.set(`table_${p1 + p2}`, table)
                client.sendMessage(message.from, `${table[0] || " "} | ${table[1] || " "} | ${table[2] || " "}\n${table[3] || " "} | ${table[4] || " "} | ${table[5] || " "}\n${table[6] || " "} | ${table[7] || " "} | ${table[8] || " "}`)
                checkWinner()
            }
            else{
                message.reply("Not your turn!")
            }
            if(checkWinner() == true){
                client.sendMessage(message.from, `${message.author} won!`)
                db.set(`inGame_${p1}`, false)
                db.set(`inGame_${p2}`, false)
                db.set(`turn_${p1 + p2}`, null)
                db.set(`tictactoe_${p1}`, null)
                db.set(`tictactoe_${p2}`, null)
                db.set(`enemy_${p1}`, null)
                db.set(`enemy_${p2}`, null)
                db.set(`table_${p1 + p2}`, null)
            }
            console.log(`checked winner`)
        }
    }
    if(message.body.startsWith(`tttend`)){
        const p1 = message.author
        const p2 = db.get(`enemy_${p1}`)
        db.delete(`inGame_${p1}`)
        db.delete(`inGame_${p2}`)
        db.delete(`turn_${p1 + p2}`)
        db.delete(`tictactoe_${p1}`)
        db.delete(`tictactoe_${p2}`)
        db.delete(`enemy_${p1}`)
        db.delete(`enemy_${p2}`)
        db.delete(`table_${p1 + p2}`)
    }
}
});

function a() {
    setInterval(() => {
    if(moment().hour() == 6) {
        const timeout = 7200000
        const thanos = app.MessageMedia.fromFilePath('./assets/thanos.mp4')
        if (pagiTimeout.has("grupbebas")) {
            return;
        } else {
            client.sendMessage('6281322666718-1542203064@g.us', thanos, {sendVideoAsGif: true, caption: "Selamat pagi warga fanatik hitam"});
            pagiTimeout.add("grupbebas");
            setTimeout(() => {
                pagiTimeout.delete("grupbebas")
            }, 7200000)
        }

    }
    
}, 2000)
}

client.initialize().catch(_ => _)