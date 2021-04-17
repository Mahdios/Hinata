const {
    Command
} = require('discord-akairo');
const {
    MessageEmbed
} = require('discord.js');
const {
    search
} = require('../structures/APIProvider');
const {
    to2048Limit
} = require('../structures/ParsingFunctions');
const Pages = require('discord-pages');

class Search extends Command {
    constructor() {
        super('search', {
            aliases: ['search', 'ابحث', 's'],
            description: 'ابحث عن الانمي المفضل لك في قاعدة بياناتنا واحصل على لائحة موسعة لنتائج البحث. **ملاحظة** يتم  حصر النتائج لاول 10 صفحات بسبب حدود المنصة.',
            args: [{
                id: 'query',
                match: 'content'
            }],
            typing: true
        });
    }

    async exec(message, args) {
        const reqI = await search(args.query),
            pages = [];
        for (let i = 1; i <= (reqI.pageCount <= 5 ? reqI.pageCount : 5); i++) {
            const searchResult = await search(args.query, i),
                formattedSearchResult = searchResult.results.map(e => `[${e.anime}](${e.url}) **(${e.year})** **(${e.type})**`);
            if (searchResult.results.length < 1) throw new Error('!لم يتم العثور على نتائج مناسبة للعرض');
            for (let subResult of to2048Limit(formattedSearchResult)) {
                const pageEmbed = new MessageEmbed()
                    .setDescription(`${subResult.join('\n')}`)
                    .setColor('#7289da')
                    .setTitle(`نتائج البحث ل "**${args.query}**"`)
                pages.push(pageEmbed);
            }
        }
        const embedPages = new Pages({
            pages: pages,
            channel: message.channel,
        });
        embedPages.createPages();
    }
}

module.exports = Search;