const axios = require('axios'),
    cheerio = require('cheerio');
const data = require('./DataProvider');
const {
    parseNumericValues,
    text
} = require('./ParsingFunctions');

module.exports = {
    async anime(query, isURL) {
        const config = data.anime(query);
        const response = await axios.get(isURL ? query : config.url).catch(e => {
                throw new Error('فشل العثور على الانمي');
            }),
            $ = cheerio.load(response.data);
        const poster = $(config.cssSelectors.poster),
            info = $(config.cssSelectors.info),
            related = $(config.cssSelectors.related);
        return {
            poster: data.base(poster.find('img').data('original')),
            url: config.url,
            name: text(info.find('div.name')),
            story: text(info.find('div.story')),
            rating: parseNumericValues(info.find('button.rating-box').text()),
            genres: info.find('p.genres > a').map((_, a) => ({
                name: text($(a)),
                url: data.base($(a).attr('href'))
            })).get(),
            alternativeNames: info.find('div.names > span').map((_, span) => text($(span).contents().last())).get(),
            related: related.find('a').map((_, a) => ({
                name: text($(a)),
                url: data.base($(a).attr('href'))
            })).get(),
            other: info.find('span.info').map((_, span) => ({
                name: text($(span).prev()),
                value: text($(span))
            })).get()
        }
    },
    async animeMedia(query, episode = 1, isURL) {
        const config = data.animeMedia(query, episode);
        const response = await axios.get(isURL ? query : config.url).catch(e => {
                throw new Error('لا يمكنني العثور على الحلقة المطلوبة او الانمي اخطئ');
            }),
            $ = cheerio.load(response.data);
        return {
            name: text($(config.cssSelectors.name)),
            servers: $(config.cssSelectors.servers).find('a').map((_, a) => ({
                name: text($(a)),
                url: $(a).data('src')
            })).get(),
            subtitles: $(config.cssSelectors.subtitles).find('a').map((_, a) => text($(a))).get()
        }
    },
    async search(query, page = 1) {
        const config = data.search(query, page);
        const response = await axios.get(config.url).catch(e => {
                throw new Error('لا يمكنني البحث عن الانمي');
            }),
            $ = cheerio.load(response.data);
        return {
            results: $(config.cssSelectors.results).find(config.cssSelectors.info).map((_, el) => {
                const name = $(el).find('div.name > a'),
                    year = $(el).find('div.badges > div.badge.red'),
                    type = $(el).find('div.badges > div.badge.blue');
                return {
                    anime: text(name),
                    url: data.base(name.attr('href')),
                    year: text(year),
                    type: text(type)
                }
            }).get(),
            pageCount: parseNumericValues($(config.cssSelectors.pages).text())
        };
    },
    async lightSearch(query) {
        const config = {
                method: 'get',
                url: `https://animeblkom.net/search?query=${encodeURIComponent(query)}`,
                headers: {
                    '': 'authority: animeblkom.net, method: GET, path: /search?query=naru, scheme: https',
                    'accept': ' */*',
                    'accept-encoding': ' gzip, deflate, br',
                    'accept-language': ' en-US,en;q=0.9',
                    'cookie': ' __cfduid=dd16a26f4fc98021b78b400842fc2979f1616699573; XSRF-TOKEN=eyJpdiI6IkNheVRPTFg3a3RTZjVJWTJXdnVnWmc9PSIsInZhbHVlIjoiVXFhYnJaN0xubjBcL2h4aWxiXC9RcTRnNnBON29KakdrS3VTbGttXC9oN0JjcW1ZMTFMVnROWThwQm1UZnNCYllaMiIsIm1hYyI6ImFhOWNiN2FiZDM4NjM1OGMyZjc4MWI0NzA1NGJjZDdmZmY3ODlhZWIzZWQ2Yjk5MTdkMGUyZmZkYzJjNjBhM2EifQ%3D%3D; blkom_session=eyJpdiI6IldwOSt3Q054dmM4MzRrRTRZdEVSREE9PSIsInZhbHVlIjoiRHdiRWNFODhEbWh6MGVXZnZrZ3RFSzhhZ3M5TFpGaWZcL3FySnBlU0RhcXJGcnROajJBRDlNY2JyNFc0K01xMm4iLCJtYWMiOiJkNGI1NTQxMTg0NzIwZTk0ZDYyNGU3MjdlNTI4ODFkOWI4Y2I5YjQ0Y2UzNDNkYTBjYWQzYmQxOTViYTZkZmU1In0%3D; _awl=2.1618691229.0.4-52d93709-73f4721e600ac9d881c2fba795613794-6763652d6575726f70652d7765737431-607b449d-1; XSRF-TOKEN=eyJpdiI6IndIa1wvUGVHVGhOM24xU1J1NzRxVVV3PT0iLCJ2YWx1ZSI6ImVxZ3NMTEpTSWhmUjQ0QzZGWTZxS3l5TjZKTGRId252RzFHRldxOHBsVlFyaHRjRGlVaFMwVThXQ0xnSytkdVgiLCJtYWMiOiJmNmJhODUzYTNjN2YwM2FiZmM1Nzk5Y2FjNTA1MzVhYjZhNzUwODFkYTVjOGQ0OGE4ZGMxMzIzODFkODk1MWUyIn0%3D; blkom_session=eyJpdiI6Im1sXC9Qaks3T1ZsTGJ0RGdZbkFTXC8rdz09IiwidmFsdWUiOiJMQ1JROVVXK1VodXc3U2JWdjIyTlorUDJHQnQwOGVJT2F6ZGFFVzZNQjhFQ1VxSkRhdk04TmU1eHZ0UWRVRnZIIiwibWFjIjoiZmQwNDRhODEwYzJmOGVhMDkwYjEyMDQ1M2Y4MDM1N2U1OWE0ZjdlNmE4N2RhZDFiYjIzNzc5ZThjOWUzNGVjMSJ9',
                    'referer': ' https://animeblkom.net/',
                    'sec-ch-ua': ' "Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
                    'sec-ch-ua-mobile': ' ?0',
                    'sec-fetch-dest': ' empty',
                    'sec-fetch-mode': ' cors',
                    'sec-fetch-site': ' same-origin',
                    'user-agent': ' Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                    'x-csrf-token': ' G4lmctTtBkZfePVlN4RNIZ5yJxccDMcIKGMLKqD3',
                    'x-requested-with': ' XMLHttpRequest'
                }
            },
            response = await axios(config);
        console.log(response)
        if (!response.data) throw new Error('لا يمكنني البحث عن الانمي');
        return response.data;
    }
}