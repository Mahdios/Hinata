// UnhandledPromiseRejectionWarning
const {
    Listener
} = require('discord-akairo');
const {
    MessageEmbed
} = require('discord.js');

class Error extends Listener {
    constructor() {
        super('error', {
            event: 'error',
            emitter: 'commandHandler'
        });
    }

    exec(error, message) {
        console.error(error)
        const errorEmbed = new MessageEmbed()
            .setTitle('__تحذير__')
            .setColor('#FF0000')
            .setDescription(`**${error.message}**`)
            .setTimestamp()
        message.channel.send(errorEmbed);
    }
}

module.exports = Error;