const app = require('whatsapp-web.js')
const spot = require(`spottydl`)

module.exports = {
    name: 'dl', // Command Name
    description: 'Download music', // Command Description
    async execute(message, args, client){
        console.log(args[1])
        if (args[1].toLowerCase().includes("spotify.com")) {
        spot.getTrack(args[1]).then(async (results) => {
        let track = await spot.downloadTrack(results, "./")
        console.log(track)
        //let file = await app.MessageMedia.fromFilePath(`./${track.filename}`)
        //client.sendMessage(message.from, file)
        })
        }
    }
}