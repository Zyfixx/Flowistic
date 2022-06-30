const app = require('whatsapp-web.js')
const openai = require('openai')

module.exports = {
    name: 'ai', // Command Name
    description: 'Smart', // Command Description
    async execute(message, cArgs, client){
        const config = new openai.Configuration({
            apiKey: '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'
        })
        const oAI = new openai.OpenAIApi(config)
        cArgs.shift()
        console.log(cArgs)
        if(!cArgs){
            message.reply(`no`)
        }else{
            const response = await oAI.createCompletion({
                model: "text-davinci-002",
                prompt: cArgs.join(" "),
                temperature: 0.7,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            })
            console.log(response)
            client.sendMessage(message.from, response.data.choices[0].text)
        }
    }
}