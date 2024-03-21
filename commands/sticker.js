const app = require('whatsapp-web.js')
const db = require('quick.db')

module.exports = {
    name: 'sticker',
    description: 'Converts a media into a sticker',
    async execute(message, args, client){
        const sender = await message.getContact();
        if (args[2]) {
            if(args[1] == "name") {
                await db.set(`stickername_${sender.number}`, args[2])
                message.reply(`Sticker name set to ${args[2]}`)
            }
            if(args[1] == "author") {
                await db.set(`stickerauthor_${sender.number}`, args[2])
                message.reply(`Sticker author set to ${args[2]}`)
            }
        }
    }
}