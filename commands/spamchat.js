const app = require('whatsapp-web.js')
const wwebs = require('@deathabyss/wwebjs-sender')
//const { fromBlendMode } = require('ag-psd/dist/helpers')

module.exports = {
    name: 'spamchat',
    description: 'yh',
    async execute(message, args, client, db){
        const chat = await message.getChat();
        const argss = await message.body.slice(1).split(/ +/)
        let contact = await message.getMentions();
        let mentions = [];
        text = argss.slice(2).join(" ")
        if(contact.length >= 1) {
            mentions.push(contact[0]);
            for(let i = 0; i < argss[1]; i++) {
                await chat.sendMessage(text, { mentions });
            }
        }
        else {
            for(let i = 0; i < argss[1]; i++) {
                await chat.sendMessage(text);
            }
        }
        console.log(argss[1])
    }
}