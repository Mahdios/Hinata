const data = require('./DataProvider');
const axios = require('axios');


module.exports = {
    /**
     * Recieve an array, create an array of sub arrays that mark the points to repect 2048 limits
     * @param {Array} input
     * @returns {Array[]}
     */
    to2048Limit(input) {
        let lastIndex = 0,
            output = [];
        for (let i = 0; i <= input.length; i++) {
            let currentChunk = input.slice(lastIndex, i),
                nextChunk = input.slice(lastIndex, i + 1),
                leftChunk = input.slice(lastIndex, input.length);
            if (leftChunk.join('\n').length <= 2048) {
                output.push(leftChunk);
                break;
            }
            if (currentChunk.join('\n').length <= 2048 && nextChunk.join('\n').length >= 2048) {
                output.push(currentChunk);
                lastIndex = i;
            }
        }
        return output;
    },
    /**
     * Parses numbers and floats, returns a string incase of failure
     @param {String} string
     */
    parseNumericValues(string) {
        return /\d+\.\d+/.test(string) ? (parseFloat(string)) : (parseInt(string) || 1);
    },
    toUUID(string) {
        return string.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(p => p).join('-');
    },
    text(string) {
        return string.text().trim();
    },
    isValidURL(segment, ...args) {
        return axios.get(data[segment](...args).url).then(() => true).catch(() => false);
    }
}