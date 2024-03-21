const app = require('whatsapp-web.js')
const db = require('quick.db')

module.exports = {
    name: 'tosticker',
    description: 'Converts a media into a sticker',
async execute(message, args, client){
    const sender = await message.getContact();
    console.log(sender)
    if (message.hasQuotedMsg) {
        const repliedMsg = await message.getQuotedMessage();
        if (repliedMsg.hasMedia) {
            const media = await repliedMsg.downloadMedia();
            if(args[1] == "author") {
                client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: /*await db.get(`stickerauthor_${sender.number}`) ||*/ sender.pushname, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
            }
            else {
                client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
            }
        } else if (message.hasMedia) {
            const media = await message.downloadMedia();
            if(args[1] == "author") {
                client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: /*await db.get(`stickerauthor_${sender.number}`) ||*/ sender.pushname, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
            }
            client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
        } else {
            return message.reply(`Eweuh fotona co`);
        }
    } else if (message.hasMedia) {
        const media = await message.downloadMedia();
        if(args[1] == "author") {
            client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: /*await db.get(`stickerauthor_${sender.number}`) ||*/ sender.pushname, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
        }
        client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerName: /*await db.get(`stickername_${sender.number}`) || */"Sticker Bot"});
    } else {
        return message.reply(`Eweuh fotona co`);
    }
}
}