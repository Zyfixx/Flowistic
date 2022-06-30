const app = require('whatsapp-web.js')

module.exports = {
    name: 'tosticker',
    description: 'Converts a media into a sticker',
    async execute(message, args, client){
        if(message.hasQuotedMsg) {
            var replied = message.getQuotedMessage()
            if((await replied).hasMedia) {
                const media = await (await replied).downloadMedia().then(media =>
                    client.sendMessage(message.from, media, {sendMediaAsSticker: true }))
            }else {
                if(message.hasMedia){
                    const media = await message.downloadMedia().then(media => {
                    client.sendMessage(message.from, media, { sendMediaAsSticker: true })
                    })
                }
            
            if(!message.hasMedia) return message.reply(`Please provide an image!`)
            }
        }else {
            if(message.hasMedia){
                const media = await message.downloadMedia().then(media => {
                client.sendMessage(message.from, media, { sendMediaAsSticker: true })
                })
            }
        
        if(!message.hasMedia) return message.reply(`Please provide an image!`)
        }
    }
}