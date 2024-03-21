const app = require('whatsapp-web.js')
const qrc = require('qrcode-terminal')
const fs = require('fs')
const path = './session.json'
const qdb = require('quick.db');
const db = new qdb.QuickDB();
const cntr = require(`country-code-lookup`)
const ms = require('ms')
const request = require(`request`)
const moment = require('moment')
const momentz = require('moment-timezone');
const vm = require('vm')
const wwebs = require('@deathabyss/wwebjs-sender')
const ttt = require(`tictactoe_model`)
const spot = require('spottydl')
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
});

client.on('message', async message => {
    const chat = await message.getChat();
    const sender = await message.getContact();
    const prefix = `!` || await db.get(`group_${message.from}_prefix`) || `!`;
    const args = message.body.slice(prefix.length).toLowerCase().split(/ +/);
    const cArgs = message.body.slice(prefix.length).split(/ +/);

    moment.tz.setDefault("Asia/Jakarta")
    moment.locale("id")
    console.log(`${message.from} | ${message.body}`)

    //if(chat.isGroup == false) {
    //    if(!await db.get(`user_${message.from}_warned`)) {
    //        client.sendMessage(message.from, `Please add me to a group since I don't work in Private Chat!`) 
    //        await db.set(`user_${message.from}_warned`, true)  
    //    }
    //}

    //xp(message)
  //async function xp(message) {
    //await db.add(`guild_${message.from}_xp_${message.author}`, 1);
    //const mAuthor = message.author
    //let filter = mAuthor.slice(0, -5)
    //let xp = await db.get(`guild_${message.from}_xp_${message.author}`)
    //let lvl = await db.get(`guild_${message.from}_level_${message.author}`) || await db.set(`guild_${message.from}_level_${message.author}`,1);
    //let level = Math.floor(Math.pow(lvl / 0.1, 2));
    //if (xp > level) {
    //    let newLevel = await db.set(`guild_${message.from}_level_${message.author}`,lvl + 1);
    //    client.sendMessage(message.from, `:tada: @${await db.get(`username_${filter}`) || mAuthor}, You just advanced to level ${newLevel}!`);
    //}
  //} 
  if(1 == 1) {
    if(message.body.startsWith(`${prefix}ping`)) {
        message.reply(`Pong`)
    };
    if(message.body.startsWith(`${prefix}tosticker`)) {
        commands.get('tosticker').execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}sticker`)) {
        commands.get('sticker').execute(message, args, client)
    }
    if(message.body.startsWith(`${prefix}osuprofile`)) {
        commands.get('osuprofile').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}xp`)) {
        //console.log(await db.get(`guild_${message.from}_xp_${message.author}`))
        message.reply(`${await db.get(`guild_${message.from}_xp_${message.author}`)}`)
    }
    if(message.body.startsWith(`${prefix}rank`)) {
        if(message.author) {
            const mAuthor = message.author
            let filter = mAuthor.slice(0, -5)
            let user = await db.get(`username_${filter}`)
    

            let level = await db.get(`guild_${message.from}_level_${message.author}`) || 0;
            let exp = await db.get(`guild_${message.from}_xp_${message.author}`) || 0;
            let neededXP = Math.floor(Math.pow(level / 0.1, 2));
  
            let all = await db.all();
            let every = all.filter(i => i.id.startsWith(`guild_${message.from}`)).sort((a, b) => b.value - a.value);
            let rank = every.map(x => x.id).indexOf(`us_xp_${message.author}`) + 1;
            console.log(await db.all())
            client.sendMessage(message.from,
`User: ${user || message.author}
Level: ${level}
XP: ${exp}
Needed XP to level up: ${neededXP}
Rank: ${rank}`)
        }
    }
    if(message.body.startsWith(`${prefix}resetrank`)){
        await db.delete(`guild_${message.from}_level_${message.author}`)
        await db.delete(`guild_${message.from}_xp_${message.author}`)
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
                    await db.set(`username_${filter}`,  `${username}`)
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
                    const username = await db.get(`username_${filter}`)
            await db.delete(`username_${message.author}`)
            client.sendMessage(message.from, `Username "${username}" deleted`)
        }
        if(!args[1]) {
            message.reply(`What do you want to do with your username? (Available Options: ['set', 'del'])`)
        }
    }
    if(message.body.startsWith(`${prefix}bind`)) {
        
    }
    if(message.body.startsWith(`${prefix}unbind`)) {
        await db.delete(`osuprofile_${message.author}`)
        client.sendMessage(message.from, `Your osu! profile has been unbound`)
    }
    if(message.body.startsWith(`${prefix}everyone`)) {
        //const timeout = 3600000;
        //const cooldown = null //await await db.fetch(`cooldown_everyone_${message.from}`);
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
        //    await db.set(`cooldown_everyone_${message.from}`, Date.now());
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
    if(message.body.startsWith(`${prefix}quran`)) {
        commands.get('quran').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}qsurah`)) {
        commands.get('qsurah').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}meme`)) {
        commands.get('meme').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}dl`)) {
        commands.get('dl').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}gamemode`)) {
        const cArgs = args.slice(1).join(' ')
        if(cArgs == 'm' || cArgs == `mania`) {
            await db.set(`user_${message.author}_dgm`, `mania`)
            message.reply(`Your default gamemode is now set to mania`)
        }
        if(!cArgs || cArgs == 's' || cArgs == `std` || cArgs == 'standard') {
            await db.set(`user_${message.author}_dgm`, `standard`)
            message.reply(`Your default gamemode is now set to standard`)
        }
        if(cArgs == 'c' || cArgs == `ctb` || cArgs == `catch the beat` || cArgs == 'catch') {
            await db.set(`user_${message.author}_dgm`, `catch`)
            message.reply(`Your default gamemode is now set to catch the beat`)
        }
        if(cArgs == 't' || cArgs == `taiko`) {
            await db.set(`user_${message.author}_dgm`, `taiko`)
            message.reply(`Your default gamemode is now set to taiko`)
        }
    }
    if(message.body.startsWith(`${prefix}rs`)) {
        commands.get('rs').execute(message, args, client, db)
    }
    if(message.body.startsWith(`${prefix}osupfp`)) {
        const username = args.slice(1).join('%20') || await db.get(`osuprofile_${message.author}`)
        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
              request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
            })
          }
        console.log(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${username}`)
        fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${username}`).then(res => res.json())
        .then(async output => {
            const user = output[0]
            if(!user.user_id) {
                message.reply("User not found")
            } else {
            const userId = output[0].user_id
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
        if(await db.get(`vote_${message.from}_contact_${contact.id.user}`) != message.body || !await db.has(`vote_${message.from}_contact_${contact.id.user}`)){
            await db.set(`vote_${message.from}_contact_${contact.id.user}`, message.body)
            await db.add(`voteOpt_${message.from}_${message.body}`, 1)
        }
    }
    if(message.body.startsWith(`${prefix}result`)){
        const list = await message.getQuotedMessage()
        const listOpt = ["Nanda", "Ipan"]

        client.sendMessage(message.from, `Nanda: ${await db.get(`${message.from}_Nanda`)}\nIpan: ${await db.get(`${message.from}_Ipan`)}`)

    }
    if(message.body.startsWith(`${prefix}resetlist`)){
        const votes = await db.all().filter(i => i.ID.startsWith(`voteOpt_${message.from}_`))
        client.sendMessage(message.from, `List data deleted. End of result:
        Nanda: ${await db.get(`voteOpt_${message.from}_Nanda`)}\nIpan: ${await db.get(`voteOpt_${message.from}_Ipan`)}`)
        votes.forEach(async i => await db.delete(i))
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
    //if(await db.get(`ttt_inGame_${message.author}`)){
    //    const p1 = message.author
    //    const p2 = await db.get(`ttt_enemy_${p1}`)
    //    const table = new Board(await db.get(`ttt_table_${p1.slice(0,-5) + p2.slice(0,-5)}`))
    //    if(isNaN(message.body)) return message.reply(`Invalid Number!`)
    //    else{
    //        if(await db.get(`ttt_firstPlayer_${message.author}`) == message.author){
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
        await db.delete(`ttt_inGame_${message.author}`)
    }
    if(await db.get(`inGame_${message.author}`) == true){
        function convertToCoordinates(number) {
            const col = Math.floor((number - 1) / 3);
            const row = ((number % 3) || 3) - 1;
            return [row, col];
        }
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (table[a] && table[a] === table[b] && table[a] === table[c]) {
            return true;
        }
    }

    return false;
}
        const p1 = message.author
        const p2 = await db.get(`enemy_${p1}`)
        const table = await db.get(`table_${p1 + p2}`)
        while(checkWinner() == false){
            var move = message.body
            if(isNaN(move)) {
                message.reply(`Invalid Number!`)
                await db.delete(`inGame_${p1}`)
                await db.delete(`inGame_${p2}`)
                await db.delete(`turn_${p1 + p2}`)
                await db.delete(`tictactoe_${p1}`)
                await db.delete(`tictactoe_${p2}`)
                await db.delete(`enemy_${p1}`)
                await db.delete(`enemy_${p2}`)
                await db.delete(`table_${p1 + p2}`)
                message.reply(`endenednednednd`)
            }
            else if(await db.get(`tictactoe_${message.author}`) == await db.get(`turn_${p1 + p2}`)){
                console.log(`move is a number`)
                await db.set(`turn_${p1 + p2}`, await db.get(`turn_${p1 + p2}`) == 'X' ? 'O' : 'X')
                table[move] = await db.get(`tictactoe_${message.author}`)
                await db.set(`table_${p1 + p2}`, table)
                client.sendMessage(message.from, `${table[0] || " "} | ${table[1] || " "} | ${table[2] || " "}\n${table[3] || " "} | ${table[4] || " "} | ${table[5] || " "}\n${table[6] || " "} | ${table[7] || " "} | ${table[8] || " "}`)
                checkWinner()
            }
            else{
                message.reply("Not your turn!")
            }
            if(checkWinner() == true){
                client.sendMessage(message.from, `${message.author} won!`)
                await db.set(`inGame_${p1}`, false)
                await db.set(`inGame_${p2}`, false)
                await db.set(`turn_${p1 + p2}`, null)
                await db.set(`tictactoe_${p1}`, null)
                await db.set(`tictactoe_${p2}`, null)
                await db.set(`enemy_${p1}`, null)
                await db.set(`enemy_${p2}`, null)
                await db.set(`table_${p1 + p2}`, null)
            }
            console.log(`checked winner`)
        }
    }
    if(message.body.startsWith(`tttend`)){
        const p1 = message.author
        const p2 = await db.get(`enemy_${p1}`)
        await db.delete(`inGame_${p1}`)
        await db.delete(`inGame_${p2}`)
        await db.delete(`turn_${p1 + p2}`)
        await db.delete(`tictactoe_${p1}`)
        await db.delete(`tictactoe_${p2}`)
        await db.delete(`enemy_${p1}`)
        await db.delete(`enemy_${p2}`)
        await db.delete(`table_${p1 + p2}`)
    }
}
});

function a() {
    setInterval(() => {
        if (moment().hour() === 6) {
            const timeout = 7200000;
            const thanos = app.MessageMedia.fromFilePath('./assets/thanos.mp4');
            if (!pagiTimeout.has("grupbebas")) {
                client.sendMessage('6281322666718-1542203064@g.us', thanos, {sendVideoAsGif: true, caption: "Selamat pagi warga fanatik hitam"});
                pagiTimeout.add("grupbebas");
                setTimeout(() => {
                    pagiTimeout.delete("grupbebas");
                }, timeout);
            }
        }
    }, 2000);
}

client.initialize().catch(_ => _)