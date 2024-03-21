const app = require('whatsapp-web.js')
const wwebs = require('@deathabyss/wwebjs-sender')
//const { fromBlendMode } = require('ag-psd/dist/helpers')

module.exports = {
    name: 'buttontest',
    description: 'aaaaa',
    async execute(message, args, client){
        var nEmbed = new wwebs.MessageEmbed()
        .sizeEmbed(28)
        .setTitle("Test Title")
        .setDescription("Test Description")
        var button1 = new wwebs.MessageButton()
        .setLabel("✔")
        var button2 = new wwebs.MessageButton()
        .setLabel("slebew🥶")
        var ab = new app.Buttons(
            "Test",
            [
                {body: "Test1"}, {body: "Test2"}
            ],
            "lol")
        wwebs.send({
            client: client,
            number: message.from,
            embed: nEmbed,
            button: [button1, button2]
        })
    }
}