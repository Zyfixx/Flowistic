const app = require('whatsapp-web.js')
const quoteAPI = require(`quote-indo`)

module.exports = {
    name: 'quotes', // Command Name
    description: 'aksdjalkda', // Command Description
    async execute(message, args, client){
        if(args[1] == "bucin") {
            const quote = await quoteAPI.Quotes("bucin")
            message.reply(quote)
        }
        else if(args[1] == "galau") {
            const quote = await quoteAPI.Quotes("galau")
            message.reply(quote)
        }
        else if(args[1] == "kehidupan") {
            const quote = await quoteAPI.Quotes("kehidupan")
            message.reply(quote)
        }
        else {
            const quote = await quoteAPI.Quotes("random")
            client.sendMessage(message.from, quote)
            console.log("asdadasdasdsa\n", quote)
        }
    }
}