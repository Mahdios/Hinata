const {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler
} = require('discord-akairo')
const {
    join
} = require('path');
//const mongoose = require('mongoose')
const Logger = require('./structures/Logger');
//const SettingsProvider = require('./structures/SettingsProvider')
const config = require('../config.json');

class BoilerplateClient extends AkairoClient {
    constructor() {
        super({
            ownerID: config.owners
        }, {
            disableEveryone: true
        })
        this.config = config;
        this.logger = Logger;
        //this.settings = new SettingsProvider()
        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, 'commands'),
            prefix: message => {
                /*
                if (message.guild) return this.settings.get(message.guild, 'prefix', this.config.prefix)
                else return this.config.prefix
                */
                return this.config.prefix;
            },
            automateCategories: true,
            commandUtil: true
        });
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(__dirname, 'inhibitors')
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, 'listeners'),
            automateCategories: true
        });
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            process: process,
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });
    }

    async _init() {
        /*
    await mongoose.connect(this.config.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    this.logger.info('MongoDB connection established.')
    this.settings.init()
    this.logger.info('Settings initialized.')
*/
        this.commandHandler.loadAll();
        this.logger.info('Commands loaded.')

        this.inhibitorHandler.loadAll();
        this.logger.info('Inhibitors loaded.')

        this.listenerHandler.loadAll();
        this.logger.info('Listeners loaded.')
    }

    async start() {
        await this._init()
            .catch(err => {
                this.logger.error(err);
                process.exit(1);
            });
        return this.login(this.config.token);
    }
}

module.exports = BoilerplateClient;