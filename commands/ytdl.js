const app = require('whatsapp-web.js')
const Youtube = require(`simple-youtube-api`)
const fs = require(`fs`)
const { title } = require('process')

module.exports = {
    name: 'ytdl', // Command Name
    description: 'Downloads YouTube video', // Command Description
    async execute(message, args, client, db){
    }
}