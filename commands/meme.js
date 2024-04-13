const app = require('whatsapp-web.js')
const qdb = require(`quick.db`)

module.exports = {
    name: 'meme', // Command Name
async execute(message, args, client, db){
        //const apiUrl = `https://candaan-api.vercel.app/api/image/random`;
        const apiUrl = `https://meme-api.com/gimme/indonesia`
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)
        const media = await app.MessageMedia.fromUrl(data.url);
        await client.sendMessage(message.from, media, {caption: data.title});
    }
}