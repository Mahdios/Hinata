const {
    Command
} = require('discord-akairo');
const {
    MessageEmbed
} = require('discord.js');
const Pages = require('discord-pages');
const {
    base
} = require('../structures/DataProvider');
const {
    toUUID
} = require('../structures/ParsingFunctions');
const {
    anime,
    lightSearch
} = require('../structures/APIProvider');

class Anime extends Command {
    constructor() {
        super('anime', {
            aliases: ['anime', 'انمي', 'a'],
            description: 'احصل على المعلومات الكاملة للانمي المعطى',
            args: [{
                id: 'anime',
                match: 'content'
            }],
            typing: true
        });
    }

    async exec(message, args) {
        anime(toUUID(args.anime))
            .then(response => {
                displayInfo(response);
            })
            .catch(async() => {
                const response = await lightSearch(args.anime);
                console.log(response)
                if (response.length < 1) throw new Error('!فشل العشور على الانمي في قاعدة البيانات');
                const results = await anime(base(response[0].url), true);
                displayInfo(results);
            })

        function displayInfo(results) {
            const infoEmbed = new MessageEmbed()
                .setTitle(`${results.name}`)
                .setURL(results.url)
                .setDescription(`\`\`\`${results.story || 'غير متوفر'}\`\`\``)
                .addField('- يقع تحت', results.genres.map(g => `[${g.name}](${g.url})`).join(' , ') || '**غير متوفر**', true)
                .addField('- التقييم', `\`${results.rating}\``, true)
                .addField('- معروف ب', results.alternativeNames.map(an => `\`${an}\``).join(' , ') || '**غير متوفر**', true)
                .addFields(results.other.map(e =>
                    ({
                        name: `- ${e.name}`,
                        value: e.value.name ? `[${e.value.name}](${e.value.url})` : `\`${e.value}\``,
                        inline: true
                    })))
                .setColor('#7289da')
            const posterEmbed = new MessageEmbed()
                .setImage(results.poster)
                .setColor('#7289da')
                .addField('- مشابه ل', results.related.slice(5).map(g => `[${g.name}](${g.url})`).join(' , ') || '**غير متوفر**', true)

            const embedPages = new Pages({
                pages: [infoEmbed, posterEmbed],
                channel: message.channel,
            });
            embedPages.createPages();
        }
    }
}

module.exports = Anime;