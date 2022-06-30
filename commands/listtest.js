const app = require('whatsapp-web.js')

module.exports = {
    name: 'listtest',
    description: 'aaaaa',
    async execute(message, args, client){
        var ab = new app.List(
            "Menang siapa",
            "Ipan vs Nanda",
            [
                {
                    title: "List",
                    rows: [
                        { id: "deez", title: "Nanda"},
                        { id: "a", title: "Ipan"},
                    ]
                }
            ], "")
        client.sendMessage(message.from, ab)
    }
}