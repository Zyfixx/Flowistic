const app = require('whatsapp-web.js')
const twitosu = require('twitosu-framework')
const fs = require(`fs`)
const db = require(`quick.db`)
require(`dotenv`)

module.exports = {
    name: 'odaily', // Command Name
    description: 'osu! Daily Stats', // Command Description
    async execute(message, args, client){
        function getMode(){
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
                return db.get(`user_${message.author}_dgm`) || 0
            }
        }
        const osuapi = process.env.osuapi
        const ripple_api_key = ""; // Ripple API(v1) token
        const data = {
            osu_name: db.get(`osuprofile_${message.author}`),
            osu_mode: getMode(),
            osu_server: 0
        }
        const db_data = {
            /* JSON data obtained from Twitosu Player data database */
            /* JSON data is obtained from the API in advance at a predetermined time and stored */
            /* Not required, but will not allow comparison with previous data */
        };
        await framework.create_image(data, db_data, osuapi, ripple_api_key)
        .then(buffer => {
        fs.writeFile(__dirname + "/" + `./Test_image.png`, buffer, err => {
                if (err != null) throw new Error(err);
            });
        });
        const media = app.MessageMedia.fromFilePath(`./Test_image.png`)
        message.reply()
    }
}