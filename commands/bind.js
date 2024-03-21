const app = require('whatsapp-web.js')
const qdb = require(`quick.db`);

module.exports = {
    name: 'bind', // Command Name
    description: 'Bind your osu! profile', // Command Description
    async execute(message, args, client) {
        const cArgs = message.body.slice(prefix.length).split(/ +/);
        const username = cArgs.slice(1).join(' ').toLowerCase();

        if (args[1]) {
            try {
                const res = await fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.osuapi}&u=${username}`);
                const output = await res.json();
                const user = output[0];

                if (!user.accuracy) {
                    message.reply("User not found");
                } else {
                    const lUsername = user.username.toLowerCase();

                    if ((await db.get(`osuprofile_${message.author}`)) !== lUsername || !(await db.get(`osuprofile_${message.author}`))) {
                        await db.set(`osuprofile_${message.author}`, user.username);
                        client.sendMessage(message.from, `Your account has been bound to ${user.username}`);
                    } else if (await db.get(`osuprofile_${message.author}`) === lUsername) {
                        message.reply(`Your account has already been bound to ${user.username}!`);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            message.reply(message.from, `Please enter your osu! username!`);
        }
    }
}