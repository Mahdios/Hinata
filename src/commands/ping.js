const {
    Command
} = require('discord-akairo');

class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping']
        });
    }

    exec(message) {
        return message.util.send(`Pong! \`${Math.round(this.client.ws.ping)}ms\``)
    }
}

module.exports = Ping