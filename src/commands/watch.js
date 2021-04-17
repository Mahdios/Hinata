const {
    Command
} = require('discord-akairo');
const {
    MessageEmbed
} = require('discord.js');
const {
    toUUID,
    is
} = require('../structures/ParsingFunctions');
const {
    animeMedia,
    search
} = require('../structures/APIProvider');
class Watch extends Command {
    constructor() {
        super('watch', {
            aliases: ['watch', 'مشاهدة', 'w'],
            description: 'مشاهدة حلقة معينة من انمي معين',
            args: [{
                id: 'anime',
                match: 'content'
            }, {
                id: 'episode',
                match: 'option',
                flag: 'e:',
                default: 1
            }],
            typing: true
        });
    }

    async exec(message, args) {
        animeMedia(toUUID(args.anime), args.episode)
            .then(response => {
                console.log('strict', response);
                displayInfo(response);
            })
            .catch(async() => {
                console.log('search');
                //message.channel.send(e.message)
                const response = await search(args.anime);
                if (response.results.length < 1) throw new Error('!فشل العشور على الانمي في قاعدة البيانات');
                const results = await animeMedia(`${response.results[0].url.replace('/anime/', '/watch/')}/${args.episode}`, args.episode, true);
                displayInfo(results);
            })

        function displayInfo(results) {
            const watchEmbed = new MessageEmbed()
                .setTitle(`مشاهدة الحلقة ${args.episode} من الانمي ${results.name}`)
                .addField('- سيرفرات المشاهدة', results.servers.map(s => `[${s.name}](${s.url})`).join(' , ') || 'غير متوفر', true)
                .addField('- المترجمين', results.subtitles.map(s => `\`${s}\``).join(' , ') || 'غير متوفر', true)
                .setColor('LIME')
            return message.channel.send(watchEmbed);
        }
    }
}

module.exports = Watch;