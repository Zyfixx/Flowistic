const app = require('whatsapp-web.js')
const qdb = require(`quick.db`)

module.exports = {
    name: 'meme', // Command Name
async execute(message, args, client, db){
        const apiUrl = `https://candaan-api.vercel.app/api/image/random`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)
        const media = await app.MessageMedia.fromUrl(data.data.url);
        await client.sendMessage(message.from, media);
    }
}