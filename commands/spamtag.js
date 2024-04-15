const app = require('whatsapp-web.js')
const wwebs = require('@deathabyss/wwebjs-sender')
//const { fromBlendMode } = require('ag-psd/dist/helpers')

module.exports = {
    name: 'spamtag',
    description: 'yh',
    async execute(message, args, client, db){

        const chat = await message.getChat();
        const argss = await message.body.slice(1).toLowerCase().split(/ +/)
        let contact = await message.getMentions();
        let text = `@${contact[0].id.user} `;
        let mentions = [];
        mentions.push(contact[0]);
        for(let i = 0; i < argss[1]; i++) {
            await chat.sendMessage(text, { mentions });
        }
        console.log(argss[1])
    }
}