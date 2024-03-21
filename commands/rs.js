const app = require('whatsapp-web.js')
const qdb = require('quick.db')
const cntr = require(`country-code-lookup`)

const filters = ['-s', '-std', '-standard', '-t', '-taiko', '-c', '-catch', '-ctb', '-m', '-mania']

const mods_enum = {
    ''    : 0,
    'NF'  : 1,
    'EZ'  : 2,
    'TD'  : 4,
    'HD'  : 8,
    'HR'  : 16,
    'SD'  : 32,
    'DT'  : 64,
    'RX'  : 128,
    'HT'  : 256,
    'NC'  : 512,
    'FL'  : 1024,
    'AT'  : 2048,
    'SO'  : 4096,
    'AP'  : 8192,
    'PF'  : 16384,
    '4K'  : 32768,
    '5K'  : 65536,
    '6K'  : 131072,
    '7K'  : 262144,
    '8K'  : 524288,
    'FI'  : 1048576,
    'RD'  : 2097152,
    'LM'  : 4194304,
    '9K'  : 16777216,
    '10K' : 33554432,
    '1K'  : 67108864,
    '3K'  : 134217728,
    '2K'  : 268435456,
    'V2'  : 536870912,
};

function getRank(current_rank) {
    switch (current_rank) {
        case 'XH':
            return 'Silver SS';
        case 'X':
            return 'SS';
        case 'SH':
            return 'Silver S';
        case 'F':
            return 'Fail';
        default:
            return current_rank;
    }
}
function getMods(enabled_mods){
    var return_array = [];
    for(var mod in mods_enum){
        if((mods_enum[mod] & enabled_mods) != 0)
            return_array.push(mod);
    }
    if(return_array == '') return return_array.push('NM')
    return return_array;
}

module.exports = {
    name: 'rs',
    description: 'idk',
async execute(message, args, client, db) {
    const getUsername = async (args) => {
        if (!args[1]) {
            return await db.get(`osuprofile_${message.author}`);
        } else {
            var name = args.slice(1).filter((word) => !filters.includes(word));
            if (name == "") {
                return await db.get(`osuprofile_${message.author}`);
            } else {
                return name;
            }
        }
    }

    const getMode = async () => {
        const modeMap = {
            '-s': 0,
            '-std': 0,
            '-standard': 0,
            '-t': 1,
            '-tai': 1,
            '-taiko': 1,
            '-c': 2,
            '-ctb': 2,
            '-catch': 2,
            '-m': 3,
            '-man': 3,
            '-mania': 3
        };

        for (const arg of args) {
            if (modeMap[arg]) {
                return modeMap[arg];
            }
        }

        return await db.get(`user_${message.author}_dgm`) || 0;
    }

    if (await db.get(`osuprofile_${message.author}`) || args[1]) {
        try {
            const response = await fetch(
                `https://osu.ppy.sh/api/get_user_recent?k=${process.env.osuapi}&u=${await getUsername(args)}&m=${await getMode()}`
            );
            const output = await response.json();
            const res = output[0];

            if (!res.beatmap_id) {
                return message.reply("User didn't play in the last 24 hours");
            }

            const text = `→ Beatmap Info
Beatmap ID: ${res.beatmap_id}
Link: https://osu.ppy.sh/b/${res.beatmap_id}
→ Score Info
Score: ${res.score}
Rank: ${getRank(res.rank)}
Mods: ${getMods(res.enabled_mods)}
Hitcount: [300: ${res.count300}, ${res.countgeki}], [100: ${res.count300}, ${res.countkatu}], [50: ${res.count50}], [Miss: ${res.countmiss}]
`;

            client.sendMessage(message.from, text);
        } catch (error) {
            console.error(error);
        }
    }
}

}