const app = require('whatsapp-web.js')

module.exports = {
    name: 'argstest', // Command Name
    description: 'the', // Command Description
    async execute(message, args, client){
        args.shift()
        console.log(args)
        message.reply(args.join(" "))
    }
}