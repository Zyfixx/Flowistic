const app = require('whatsapp-web.js')
const qdb = require(`quick.db`)

module.exports = {
    name: 'quran', // Command Name
async execute(message, args, client, db){
        const apiUrl = `https://quran-api-id.vercel.app/surahs`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        let text = "";
        for(const surah of data){
            text += `${surah.number}. Q.S ${surah.name} (${surah.translation}) [${surah.numberOfAyahs}]\n`;
        }
        await client.sendMessage(message.from, text);
    }
}