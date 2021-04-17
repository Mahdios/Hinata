const api = require('./src/structures/APIProvider');
const { toUUID, isValidURL } = require('./src/structures/ParsingFunctions')
isValidURL('animeMedia', 'death-note', 1).then(console.log);
//api.animeMedia('death-note',1).then(console.log)
