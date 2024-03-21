const app = require('whatsapp-web.js')
const qdb = require(`quick.db`)

module.exports = {
    name: 'qsurah', // Command Name
async execute(message, args, client, db) {
    const surahNumber = args[1];
    const link = `https://quran-api-id.vercel.app/surahs/${surahNumber}/ayahs`;
    const response = await fetch(link);
    const data = await response.json();
    let text = "";

    if (!args[2]) {
        for (const ayah of data) {
            text += `${ayah.number.inSurah}. ${ayah.arab}\n ${ayah.translation}\n\n`;
        }
    } else {
        if (!args[3]) {
            const selectedAyah = data[args[2] - 1];
            text += `${selectedAyah.number.inSurah}. ${selectedAyah.arab}\n ${selectedAyah.translation}\n\n`;
        } else {
            for (let i = args[2] - 1; i < args[3]; i++) {
                text += `${data[i].number.inSurah}. ${data[i].arab}\n ${data[i].translation}\n\n`;
            }
        }
    }

    await client.sendMessage(message.from, text);
}
}