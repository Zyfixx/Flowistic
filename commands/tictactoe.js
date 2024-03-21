const app = require('whatsapp-web.js')
const db = require('quick.db')
const ttt = require('tictactoe_model')

const MOVE_LIST = [

    {title: '1 (Top Left)', filled: ''},
  
    {title: '2 (Top Middle)', filled: ''},
  
    {title: '3 (Top Right)', filled: ''},
  
    {title: '4 (Middle Left)', filled: ''},
  
    {title: '5 (Middle Middle)', filled: ''},
  
    {title: '6 (Middle Right)', filled: ''},
  
    {title: '7 (Bottom Left)', filled: ''},
  
    {title: '8 (Bottom Middle)', filled: ''},
  
    {title: '9 (Bottom Right)', filled: ''},
  
]

module.exports = {
    name: 'tictactoe', // Command Name
    description: '', // Command Description
    async execute(message, args, client){
        const mentioned = await message.getMentions()
        var p1 = message.author
        if(!mentioned[0]) return message.reply(`main sama siapa banh bilek amat lu`)
        else{
            var p2 = mentioned[0].id.user + '@c.us'
            if(mentioned[0].isMe) return message.reply(`males bikin ai`)
            else{
                await db.set(`inGame_${p1}`, true)
                await db.set(`inGame_${p2}`, true)
                await db.set(`enemy_${p1}`, p2)
                await db.set(`enemy_${p2}`, p1)
                await db.set(`tictactoe_${p1}`, 'X')
                await db.set(`tictactoe_${p2}`, 'O')
                await db.set(`ttt_X`, p1)
                await db.set(`ttt_O`, p2)
                await db.set(`turn_${p1 + p2}`, 'X')
                await db.set(`table_${p1 + p2}`, [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
                client.sendMessage(message.from, ` |  | \n |  | \n |  | `)
            }
        }
    }
}