aconst app = require('whatsapp-web.js')
const db = require('quick.db')

module.exports = {
    name: 'reup',
    description: 'Converts a media into a sticker',
async execute(message, args, client){
    const sender = await message.getContact();
    console.log(sender)
    if (message.hasQuotedMsg) {
        const repliedMsg = await message.getQuotedMessage();
        if (repliedMsg.hasMedia) {
            const media = await repliedMsg.downloadMedia();
                client.sendMessage(message.from, media);
        } else {
            return message.reply(`Eweuh fotona co`);
        }
    }
}
}
