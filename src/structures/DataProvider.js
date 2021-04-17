module.exports = {
    base(path) {
        return `https://animeblkom.net${path}`;
    },
    search(query, page) {
        return {
            url: this.base(`/search?query=${encodeURIComponent(query)}&page=${page}`),
            cssSelectors: {
                results: 'div[class="content ratable"]',
                info: 'div > div.info',
                pages: 'li[class="page-item"]:nth-last-child(2)'
            }
        }
    },
    anime(query, isWatching) {
        return {
            url: this.base(`/anime/${encodeURIComponent(query)}`),
            cssSelectors: {
                poster: 'div[class="poster"]',
                info: 'div[class=" pull-right story-column"]',
                related: 'div[class="container eps-slider"] > div[class="row"]'
            }
        }
    },
    animeMedia(query, episode) {
        return {
            url: this.base(`/watch/${encodeURIComponent(query)}/${episode}`),
            cssSelectors: {
                name: '.anime-name',
                servers: '.server',
                subtitles: '.subtitle'
            }
        }
    }
}