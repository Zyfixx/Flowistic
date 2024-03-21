const app = require('whatsapp-web.js')
const qdb = require('quick.db')
const cntr = require(`country-code-lookup`)

const filters = ['-s', '-std', '-standard', '-t', '-taiko', '-c', '-catch', '-ctb', '-m', '-mania']

module.exports = {
    name: 'osuprofile',
    description: 'idk',
    async execute(message, args, client, db) {

    //function getUsername(args){
    //    console.log(args)
    //    if(args[1]) {
    //        if(args.includes()){
    //            console.log("included")
    //            return args.slice(1, -1).join(' ') || db.get(`osuprofile_${message.author}`)
    //        }else{
    //            console.log("not included")
    //            return args.slice(1).join(' ')
    //        }
    //    }
    //    else{
    //        return db.get(`osuprofile_${message.author}`)
    //    }
    //}
    console.log(args[1])
    async function getUsername(args){
        if(!args[1]) {
            return await db.get(`osuprofile_${message.author}`)
        }else{
            var name = args.slice(1).filter((word) => !filters.includes(word)).join("%20")
            console.log(`Name filtered: ${name}`)
            if(name == "") {
                return await db.get(`osuprofile_${message.author}`)
            }
            else{
                return name
            }
        }
    }
    async function getMode(){
        if(args.includes("-s" || "-std" || '-standard')) {
            return 0
        }
        else if(args.includes("-t" || "-taiko")) {
            return 1
        }
        else if(args.includes("-c" || "-ctb" || '-catch')) {
            return 2
        }
        else if(args.includes("-m" || "-mania")) {
            return 3
        }
        else {
            return await db.get(`user_${message.author}_dgm`) || 0
        }
    }



        if(db.get(`osuprofile_${message.author}`) || args[1]) {
            const un = await getUsername(args);
            const md = await getMode();
            fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${un}&m=${md}`).then(res => res.json())
            .then(output => {
                const user = output[0]
                console.log(user)
                if(!user.accuracy) return message.reply(`User not found!`)
                var userAcc = parseFloat(user.accuracy)
                var fixedAcc = userAcc.toFixed(2)
                var levelpercent = 0 + user.level.substring( + user.level.indexOf("."));
                var levelprogress = Math.floor((levelpercent / 1) * 100)
                const countryName = cntr.byInternet(`${user.country}`).country
                const text =
`User : ${user.username} (${user.user_id})
Country : ${countryName}
PP : ${Math.round(`${user.pp_raw}`)}pp
Accuracy : ${fixedAcc}%
Rank : #${user.pp_rank} (Country: #${user.pp_country_rank})
Playcount : ${user.playcount}
Level : ${parseInt(user.level)} (${levelprogress}%)`
                client.sendMessage(message.from, text)
            })
        }
        else {
            message.reply("Please provide a user or bind your account with !bind")
        }
}
}