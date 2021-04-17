const {
    Provider
} = require('discord-akairo')
const {
    Guild
} = require('discord.js')
const Setting = require('../models/Setting')

class SettingsProvider extends Provider {
    constructor(model = Setting, {
        idColumn = 'guildID',
        dataColumn = 'settings'
    } = {}) {
        super()

        this.model = model
        this.idColumn = idColumn
        this.dataColumn = dataColumn
    }

    async init() {
        const rows = await this.model.find({})
        for (const row of rows) {
            this.items.set(row[this.idColumn], this.dataColumn ? row[this.dataColumn] : row)
        }
    }

    get(guild, key, defaultValue) {
        const id = this.constructor._getGuildID(guild)
        if (this.items.has(id)) {
            const value = this.items.get(id)[key]
            return value == null ? defaultValue : value
        }
        return defaultValue
    }

    set(guild, key, value) {
        const id = this.constructor._getGuildID(guild)
        const data = this.items.get(id) || {}
        data[key] = value
        this.items.set(id, data)

        if (this.dataColumn) {
            return this.model.findOneAndUpdate({
                [this.idColumn]: id
            }, {
                [this.dataColumn]: data
            }, {
                upsert: true
            })
        }
        return this.model.findOneAndUpdate({
            [this.idColumn]: id
        }, {
            [key]: value
        }, {
            upsert: true
        })
    }

    delete(guild, key) {
        const id = this.constructor._getGuildID(guild)
        const data = this.items.get(id) || {}
        delete data[key]

        if (this.dataColumn) {
            return this.model.findOneAndUpdate({
                [this.idColumn]: id
            }, {
                [this.dataColumn]: data
            }, {
                upsert: true
            })
        }
        return this.model.findOneAndUpdate({
            [this.idColumn]: id
        }, {
            [key]: null
        }, {
            upsert: true
        })
    }

    clear(guild) {
        const id = this.constructor._getGuildID(guild)
        this.items.delete(id)
        return this.model.findOneAndDelete()
    }

    static _getGuildID(guild) {
        if (guild instanceof Guild) return guild.id
        if (guild === 'global' || guild === null) return '0'
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.')
    }
}

module.exports = SettingsProvider