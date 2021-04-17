const {
    Listener
} = require('discord-akairo');

class Ready extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.logger.info(`${this.client.user.username} is ready`);
    }
}

module.exports = Ready;